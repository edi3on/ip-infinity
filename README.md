# Eth Global Hackathon 2024

## Description

A user will input their ENS. Their NFTs get processed, labeled as a type of game object (character, equipment, other), and also given stats based on their floor price and traits. The NFTs get put into a procedurally generated map/world with full-game functionality.

## Inspirations

Skylanders and Disney Infinity: These games have physical figurines with upgrades and cosmetics stored on them. These figurines can be used in another person's console with all of the data saved.
Our goal was to integrate this concept with NFTs and tokenized IP

## How IP-Infinity works

### AI integrations

The AI was implemented by Elliot. Meta’s Llama 3.2 vision model takes images of the nfts and generates a text description of each of them, this text description is run through a zero-shot classification model which can put the text into a one word category like character, equipment, or other.

### Unreal engine

The Unreal Engine part can be divided into two different sections: the environment and the gameplay. The environment is made by Tibet. We wanted something a little more than just a basic world to make it look more appealing, and we wanted to change it up a bit. This led us to build a procedurally generated landscape, basically meaning the landscape randomly makes itself under a controlled system. Another idea was to make a dungeon, so we integrated both ideas and made the dungeon procedurally generated. The Idea worked, and we were able to download a bunch of meshes, put them into our empty dungeon shell, and make a great space to fight the user's favorite NFT. There are 3 rooms on each of our two maps, and the insides of the rooms are able to change every time you reboot the game. With our dark and creepy theme involving lots of medieval-era objects, it's a genuinely thrilling experience to play in.

The actual gameplay part is built by Edison. While the spotlight is focused on thr AI and how we are integrating it to our sponsers, the game provides an example of the AI system. The game showcases how NFTs can be properly integrated into a game.

### ts-backend

The backend was implemented by Kaan. He used Story’s SDK for minting NFTS and registering a new IPA for each NFT in the user's wallet.

Royalties & Licensing Module

- if someone wants to list their thing for commercial use, my server is called with the amount of rev-share the user wants and how much the minting fee should be. I then created and attached a license for that.
- if someone wants to use their IP, my server is called, and a license is minted, which also creates the royalty vault
- users can check their revenue balance/claim revenue by calling my server through the game
That is all for now, but in the future, we can expand on licensing and finish up disputes.

Reputation

- I deployed a contract on four different chains scale, story, rootstock, and polygon, and minted one token on each
- along with royalties, we also have reputation points, so whenever an NFT is interacted with, the owners reputation can be increased by the use of these tokens
- It can be used on any L2 chain, and in this case I used, Polygon, Story, Skale, and Rootstock.

Disputes 

- where being made, ran into errors, and ran out of time
- plan to integrate in the future



### 

## Prizes we’re applying for

### Story (Best Overall Use of the Proof of Creativity Protocol and Best AI Application on Story)

The story allows users to collaborate with each other really easily without needing to deal with legal disputes. Players are able to build off of each other in a much easier environment. 

### ENS

ENS allows us to get the user’s wallet very easily. ENS also allows us to easily identify users, ENS serves as a built in username system for us.

### Layer two chains
-Polygon
-Rootstock
-Skale
These allow us to deploy future commercial tokens with monetary value and our current reputation system. Each of these provides helpful tools for our project. For example, Skale provides zero gas fees, Rootstock provides integrations with Bitcoin (Mergemining), and Polygon allows for faster transactions.

## Challenges we ran into

-Dealing with non-image NFTs (gifs, videos, etc)

-Getting Llama to generate a suitable text description

-Getting the run time lower

-Implementing 2d NFTs into a 3d game world

-Getting images loaded into ui in unreal engine

-coordinating a workflow with the team

## What we learned

Tibet: I learned that making a landscape in Unreal Engine is not easy and that it requires lots of hard work and long hours of experimenting with things until they seem right. Sometimes, things don’t work, and you have to restart the whole thing, which gets very frustrating. But if you keep trying, it will always somehow work out, so just keep trying, and don’t give up.

Elliot: I learned a lot more about AI, working with .json files, and GitHub. I also experienced coding as a team, which was both challenging and rewarding.

Edison: I learned that ue5 front end is not as easy as it seems. Although you could just put a couple buttons in, it is pretty hard to make it look good.

## What’s next

Expanding the map to be fully procedually generated and adding many more ways to generate NFTs in the map.

Authentication: have the user sign message with their wallet

Increasing accuracy of categorization with fine-tuned models

Integration of a monetized reward system from Royalties

Implementing more advanced game mechanics and interactions with AI
