# Eth Global Hackathon 2024

## Description

A user will input their ENS, their nfts get processed, labeled as a type of game object (character, equipment, other) and also given stats based on it’s floor price and traits. The nfts get put into a procedurally generated map/world with full game functionality.

## Inspirations

Skylanders and Disney Infinity: These games have physical figurines with upgrades and cosmetics stored on them. These figurines can be used in another persons console with all of the data saved.
Our goal was integrate this concept with NFTs and tokenized IP

## How IP-Infinity works

### AI integrations

The AI was implemented by Elliot. Meta’s Llama 3.2 vision model takes images of the nfts and generates a text description of each of them, this text description is run through a zero-shot classification model which can put the text into a one word category like character, equipment, or other.

### Unreal engine

The Unreal Engine part can be divided into 2 different sections, the environment and the gameplay. The environment is made by Tibet. We wanted something a little more than just a basic world to make it look more appealing, and wanted to change it up a bit. This lead us to building a procedurally generated landscape, basically meaning the landscape randomly makes itself under a controlled system. another idea was to make a dungeon, so we integrated both ideas and made the dungeon procedurally generated. The Idea worked and we were able to download a bunch of meshes and put them into our empty dungeon shell, and made a great space to fight the users favorite NFT. There are 3 rooms on each of our two maps and the insides of the rooms are able to change every time your reboot the game. With our dark and creepy theme involving lots of medieval era objects, its a genuinely thrilling experince to play in.

The actual gameplay part is built by Edison.

### ts-backend

The backend was implemented by Kaan. He used Story’s SDK for minting NFTS and registering a new IPA, for each NFT in the users wallet.

process would be for royalties

- if someone wants to list their thing for commercial usel, my server is called with the amount of revshare the user wants and how much the minting fee should be. i then crete and attahc a license for that.
- if someone wants to use their IP my server is called, and a license is minted, which also creates the royalty vault
- users can check their revenue balance / claim revenue by calling my server through the game
- thats all for now, but int he futrue we can expand on licensing and finish up disputes

Reputation

- i deployed a contract on 4 different chains skale, story, rootstock, and polygon, and minted 1 token on each
- along with royalties, we also have reputation points, so wheneevr an nft is interacted with, their reputation can be increased by the use of these tokens
- they work on all 4 chains

Disputes 

- where being made, ran into errors and ran out of time
- plan to integrate in the future

Kaan script

My main focus was to  integrate all the sponsors which included Story, Polygon, Skale, and sootstock into the project.

 For Story, I utilized their SDK to:

1. Register IPAs (Intellectual Property assests) for all NFTs used in the game.
2. allow users to choose which IPAs they want to list for commercial use and modify their licenses.
3. Integrate the royalty module, allowing users to view or claim their revenue.

I

In addition, I developed a reputation system that can be adapted to any L2 chain in this case i used Polygon, Skale, Story and rootstock

### 

## Prizes we’re applying for

### Story (Best Overall Use of the Proof of Creativity Protocol, and Best AI Application on Story)

Story allows users to collaborate with each other really easily without needing to deal with legal stuff. Players are able to build off of each other 

### ENS

ENS allows us to get the user’s wallet very easily. ENS also allows us to easily identify users, by using a very readable username the player is al

### Nouns?

## Challenges we ran into

Dealing with non-image nfts (gifs, videos, etc)

Getting Llama to generate a suitable text description

Getting the run time lower

Implementing 2d nfts into a 3d game world

getting images loaded into ui in unreal engine

sharing ue5 with teammates

## What we learned

Tibet: I learned that making a landscape in unreal engine is not easy, that it requires lots of hard work and long hours experimenting with things until they seem right. Sometimes things don’t work, and you have to restart the whole thing, which gets very frustrating. But if you keep trying, it will always somehow work out, so just keep trying, and don’t give up.

## What’s next

Tibet: expanding the map and go from just a few handmade rooms, to the pcg making the whole rooms for me.

Authentication: have user sign message with their wallet
