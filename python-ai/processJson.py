import os
import json
import time
from dotenv import load_dotenv
from groq import Groq
import base64
from transformers import BlipProcessor, BlipForConditionalGeneration, pipeline
from PIL import Image
import torch
from io import BytesIO
import aiohttp
import asyncio
import random


# Start time for the script
start = time.time()

# Load environment variables
load_dotenv()
key = os.getenv("key")

# Load the JSON file containing NFT data
with open("nft_data.json", "r") as file:
    nft_data = json.load(file)

# Extract image URLs from the cached URLs in the JSON data
image_urls = [nft["image"]["cachedUrl"] for nft in nft_data]

# Define categories for classification
character_labels = [
    "Animal", "Person", "Man", "Woman", "Child", "Human", "Alien", "Monster", "Robot", "Creature", "Skeleton", "Insect"
]
ranged_weapon_labels = [
    "Bow", "Crossbow", "Arrow", "Flamethrower", "Sling shot", "Kunai", "Shuriken", "Catapult", "Gun", "Rifle", "Bullet",
    "Machine gun", "Pistol"
]
melee_weapon_labels = [
    "Axe", "Sword", "Blade", "Dagger", "Flail", "Mace", "Spear", "Club", "Quarterstaff", "Warhammer", "Knife",
    "War scythe", "Baton", "Pickaxe"
]
magic_weapon_labels = [
    "Magic Staff", "Wand", "Spellbook", "Scepter"
]
explosive_weapon_labels = [
    "Bomb", "Dynamite", "Rocket launcher", "Cannon"
]
defense_labels = [
    "Clothing", "Mask", "Shoe", "Shirt", "Pants", "Jacket", "Sweater", "Shield", "Armor"
]
character_boost_list = ["fur", "eye", "eyes", "mouth", "skin", "face", "hair", "head", "neck", "body", "birth-chain", "ethnicity", "complexion", "ear", "eyeball", "nose", "teeth", "hand", "leg"]
ranged_weapon_boost_list = ["ammo", "calibre", "scope"]
melee_weapon_boost_list = ["blade", "sharpness"]
magic_weapon_boost_list = ["mana"]
explosive_weapon_boost_list = []
defense_boost_list = ["defense"]

# Initialize Groq client for LLaMA
client = Groq(api_key=key)

# Initialize the BLIP model for image captioning
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# Initialize zero-shot classification model using DeBERTa
classifier = pipeline("zero-shot-classification", model="MoritzLaurer/DeBERTa-v3-base-mnli",
                      device=0 if torch.cuda.is_available() else -1, batch_size=32)

# Cache directory for images
image_cache_dir = "image_cache"
os.makedirs(image_cache_dir, exist_ok=True)


# Describe the image using Groq API (Llama)
def describe_image_with_groq(encoded_image):
    prompt = "Describe the image and important defining traits in a descriptive 10-word or less sentence."
    try:
        completion = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{encoded_image}"}}
                    ]
                }
            ],
            temperature=0.6,
            max_tokens=50,
            top_p=0.6,
            stream=False,
            stop=None
        )
        description = completion.choices[0].message.content.strip()
        return description
    except Exception as e:
        print(f"Failed to process image with Groq: {e}")
        return None


# Function to classify an image description and get confidence scores
def classify_description(description, nft_rarities, character_threshold=0.3, equipment_threshold=0.3):
    categories = character_labels + ranged_weapon_labels + melee_weapon_labels + magic_weapon_labels + explosive_weapon_labels + defense_labels
    if description:
        result = classifier(description, candidate_labels=categories, multi_label=False)
        labels = result["labels"]
        scores = result["scores"]

        # Initialize confidence boosts
        boosts = {
            "Character": 0,
            "Ranged Weapon": 0,
            "Melee Weapon": 0,
            "Magic Weapon": 0,
            "Explosive Weapon": 0,
            "Defense": 0
        }

        # Check if nft_rarities exist before applying boosts
        if nft_rarities and "rarities" in nft_rarities:
            for trait in nft_rarities["rarities"]:
                trait_type = trait["traitType"].lower()

                if trait_type in character_boost_list:
                    boosts["Character"] += 0.1
                elif trait_type in ranged_weapon_boost_list:
                    boosts["Ranged Weapon"] += 0.1
                elif trait_type in melee_weapon_boost_list:
                    boosts["Melee Weapon"] += 0.1
                elif trait_type in magic_weapon_boost_list:
                    boosts["Magic Weapon"] += 0.1
                elif trait_type in explosive_weapon_boost_list:
                    boosts["Explosive Weapon"] += 0.1
                elif trait_type in defense_boost_list:
                    boosts["Defense"] += 0.1

        # Apply the boost to the corresponding category
        boosted_scores = {
            "Character": max([scores[i] for i, label in enumerate(labels) if label in character_labels]) + boosts["Character"],
            "Ranged Weapon": max([scores[i] for i, label in enumerate(labels) if label in ranged_weapon_labels]) + boosts["Ranged Weapon"],
            "Melee Weapon": max([scores[i] for i, label in enumerate(labels) if label in melee_weapon_labels]) + boosts["Melee Weapon"],
            "Magic Weapon": max([scores[i] for i, label in enumerate(labels) if label in magic_weapon_labels]) + boosts["Magic Weapon"],
            "Explosive Weapon": max([scores[i] for i, label in enumerate(labels) if label in explosive_weapon_labels]) + boosts["Explosive Weapon"],
            "Defense": max([scores[i] for i, label in enumerate(labels) if label in defense_labels]) + boosts["Defense"]
        }

        # Determine the highest scoring category after boost
        highest_character_confidence = boosted_scores["Character"]
        highest_equipment_confidence = max(
            boosted_scores["Ranged Weapon"],
            boosted_scores["Melee Weapon"],
            boosted_scores["Magic Weapon"],
            boosted_scores["Explosive Weapon"],
            boosted_scores["Defense"]
        )

        # Check if the confidence levels meet the threshold, otherwise set the category to "Other"
        if highest_character_confidence >= character_threshold:
            final_category = "Character"
        elif highest_equipment_confidence >= equipment_threshold:
            # Choose the equipment category with the highest confidence
            final_category = max(
                ["Ranged Weapon", "Melee Weapon", "Magic Weapon", "Explosive Weapon", "Defense"],
                key=lambda cat: boosted_scores[cat]
            )
        else:
            final_category = "Other"

        return final_category

    return "Other"


# Helper function to generate a stat based on the floor price and prevalence
def generate_stat(floor_price, prevalence, stat_type="general"):
    base_stat = 1 + floor_price * 65  # Base stat scaled by floor price (range 1-100)
    rarity_multiplier = (1 - prevalence) * 35  # Rarer traits give a higher bonus

    # Add randomness to the final stat (small random factor +/- 45% around the calculated stat)
    random_factor = random.uniform(-0.45, 0.45)

    # Final stat is base stat plus rarity bonus with added randomness
    final_stat = base_stat + rarity_multiplier * 0.5
    final_stat = final_stat + final_stat * random_factor  # Apply randomness

    # Cap at 100 and ensure no lower than 1
    return min(100, max(1, int(final_stat)))


# Generate stats based on floor price and trait prevalence
# Function to generate stats based on category, floor price, and trait prevalence, with randomness
def generate_stats(category, floor_price=0, rarity=None, equipment_details=None):
    if category == "Character":
        health = 0
        intelligence = 0
        stamina = 0
        if rarity and "rarities" in rarity:
            for trait in rarity["rarities"]:
                prevalence = trait.get("prevalence", 1)
                health = generate_stat(floor_price, prevalence, "health")
                intelligence = generate_stat(floor_price, prevalence, "intelligence")
                stamina = generate_stat(floor_price, prevalence, "stamina")
        else:
            # In case there are no traits, generate stats with some randomness
            health = generate_stat(floor_price, random.uniform(0.2, 0.8), "health")
            intelligence = generate_stat(floor_price, random.uniform(0.2, 0.8), "intelligence")
            stamina = generate_stat(floor_price, random.uniform(0.2, 0.8), "stamina")
        return {
            "Health": health,
            "Intelligence": intelligence,
            "Stamina": stamina
        }
    elif category == "Defense":
        defense = 0
        durability = 0
        if rarity and "rarities" in rarity:
            for trait in rarity["rarities"]:
                prevalence = trait.get("prevalence", 1)
                defense = generate_stat(floor_price, prevalence, "defense")
                durability = generate_stat(floor_price, prevalence, "durability")
        else:
            defense = generate_stat(floor_price, random.uniform(0.2, 0.8), "defense")
            durability = generate_stat(floor_price, random.uniform(0.2, 0.8), "durability")
        return {
            "Defense": defense,
            "Durability": durability
        }
    elif category in ["Ranged Weapon", "Melee Weapon", "Magic Weapon", "Explosive Weapon"]:
        attack = 0
        durability = 0
        if rarity and "rarities" in rarity:
            for trait in rarity["rarities"]:
                prevalence = trait.get("prevalence", 1)
                attack = generate_stat(floor_price, prevalence, "attack")
                durability = generate_stat(floor_price, prevalence, "durability")
        else:
            attack = generate_stat(floor_price, random.uniform(0.2, 0.8), "attack")
            durability = generate_stat(floor_price, random.uniform(0.2, 0.8), "durability")
        return {
            "Attack": attack,
            "Durability": durability
        }
    else:
        return {
            "Health": None,
            "Intelligence": None,
            "Stamina": None,
            "Durability": None,
            "Defense": None,
            "Attack": None
        }


# Process the images and classify each one
async def process_nft_images(nft_data):
    async with aiohttp.ClientSession() as session:
        processed_nfts = []
        download_count = 0  # Initialize a counter for successful downloads

        for nft in nft_data:
            if download_count >= 5:  # Stop processing after 5 successful downloads
                break

            image_url = nft["image"]["cachedUrl"]
            floor_price = nft.get("floor_price", 0)
            rarity = nft.get("rarity", None)

            try:
                # Attempt to download the image
                async with session.get(image_url, ssl=False) as response:
                    if response.status == 200:
                        image_data = await response.read()
                        image = Image.open(BytesIO(image_data)).convert("RGBA")

                        buffered = BytesIO()
                        image.save(buffered, format="PNG")
                        encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

                        # Use LLaMA to generate a description of the image
                        description = describe_image_with_groq(encoded_image)
                        if description:
                            print(f"Description: {description}")

                            # Use DeBERTa to classify the description and pass rarity as nft_rarities
                            category = classify_description(description, rarity)  # Pass the `rarity` here
                            print(f"Category: {category}")

                            # Generate stats based on category, floor price, and trait prevalence
                            traits = generate_stats(category, floor_price, rarity)

                            nft["AICategory"] = {
                                "value": category,
                                "traits": traits
                            }
                            processed_nfts.append(nft)

                            # Increment the counter for successfully processed NFTs
                            download_count += 1

            except Exception as e:
                print(f"Failed to process image from {image_url}: {e}")

    return processed_nfts



# Save the updated JSON data to a new file
def save_updated_json(updated_nft_data):
    with open("updated_nft_data.json", "w") as file:
        json.dump(updated_nft_data, file, indent=4)


if __name__ == "__main__":
    # Process the NFTs and generate the stats
    updated_nft_data = asyncio.run(process_nft_images(nft_data))

    # Save the updated JSON with the new stats
    save_updated_json(updated_nft_data)
    print(f"Total time: {time.time() - start}")
