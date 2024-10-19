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
import random
import asyncio

# Start time for the script
start = time.time()

# Load environment variables
load_dotenv()
key = os.getenv("key")

# Load the JSON file containing NFT data
with open("aiJson/nft_data.json", "r") as file:
    nft_data = json.load(file)

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
            return "Character", None
        elif highest_equipment_confidence >= equipment_threshold:
            # Choose the equipment category with the highest confidence
            equipment_type = max(
                ["Ranged Weapon", "Melee Weapon", "Magic Weapon", "Explosive Weapon", "Defense"],
                key=lambda cat: boosted_scores[cat]
            )
            return "Equipment", equipment_type
        else:
            return "Other", None

    return "Other", None


# Helper function to generate a stat based on the floor price and prevalence
def generate_stat(floor_price, prevalence, stat_type="general"):
    base_stat = 1 + floor_price * 70  # Base stat scaled by floor price (range 1-100)
    rarity_multiplier = (1 - prevalence) * 35  # Rarer traits give a higher bonus

    # Add randomness to the final stat (small random factor +/- 25% around the calculated stat)
    random_factor = random.uniform(-0.15, 0.15)

    # Final stat is base stat plus rarity bonus with added randomness
    final_stat = base_stat + rarity_multiplier * 0.5
    final_stat = final_stat + final_stat * random_factor  # Apply randomness

    # Cap at 100 and ensure no lower than 1
    return min(100, max(1, int(final_stat)))


# Generate stats based on floor price and trait prevalence
def generate_stats(category, equipment_type, floor_price=0, rarity=None):
    if category == "Character":
        health = generate_stat(floor_price, random.uniform(0.2, 0.8), "health")
        intelligence = generate_stat(floor_price, random.uniform(0.2, 0.8), "intelligence")
        stamina = generate_stat(floor_price, random.uniform(0.2, 0.8), "stamina")
        return {
            "Health": health,
            "Intelligence": intelligence,
            "Stamina": stamina
        }
    elif category == "Equipment" and equipment_type:
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
def process_image(nft):
    image_url = nft["image"]["cachedUrl"]
    floor_price = nft.get("floor_price", 0)
    rarity = nft.get("rarity", None)

    try:
        # Attempt to download the image asynchronously
        async def download_image(image_url):
            # Check if the image is already in the cache
            image_filename = os.path.join(image_cache_dir, os.path.basename(image_url))
            if os.path.exists(image_filename):
                with open(image_filename, "rb") as img_file:
                    return base64.b64encode(img_file.read()).decode("utf-8")

            # Download the image if not cached
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url, ssl=False) as response:
                    if response.status == 200:
                        image_data = await response.read()
                        # Save the image to cache
                        with open(image_filename, "wb") as img_file:
                            img_file.write(image_data)
                        image = Image.open(BytesIO(image_data)).convert("RGBA")
                        buffered = BytesIO()
                        image.save(buffered, format="PNG")
                        return base64.b64encode(buffered.getvalue()).decode("utf-8")
            return None

        encoded_image = asyncio.run(download_image(image_url))
        if encoded_image:
            # Use LLaMA to generate a description of the image
            description = describe_image_with_groq(encoded_image)
            if description:
                print(f"Description: {description}")

                # Use DeBERTa to classify the description
                category, equipment_type = classify_description(description, rarity)
                print(f"Category: {category}, Equipment Type: {equipment_type}")

                # Generate stats based on category, floor price, and trait prevalence
                traits = generate_stats(category, equipment_type, floor_price, rarity)

                nft["AICategory"] = {
                    "value": category,
                    "equipment_type": equipment_type if equipment_type else None,
                    "traits": traits
                }
        return nft

    except Exception as e:
        print(f"Failed to process image from {image_url}: {e}")
        return None

# Multiprocessing wrapper to handle multiple image downloads and processing
def process_nft_images_multiprocessing(nft_data):
    processed_nfts = []
    index = 0
    while len(processed_nfts) < 5 and index < len(nft_data):
        nft = nft_data[index]
        processed_nft = process_image(nft)
        if processed_nft and "AICategory" in processed_nft:
            processed_nfts.append(processed_nft)
        index += 1
    return processed_nfts

# Save the updated JSON data to a new file
def save_updated_json(updated_nft_data):
    output = {"NFT_Data": [nft for nft in updated_nft_data if nft is not None]}
    with open("aiJson/updated_nft_data.json", "w") as file:
        json.dump(output, file, indent=4)

if __name__ == "__main__":
    # Process the NFTs and generate the stats using multiprocessing
    updated_nft_data = process_nft_images_multiprocessing(nft_data)

    # Save the updated JSON with the new stats
    save_updated_json(updated_nft_data)
    print(f"Total time: {time.time() - start}")
