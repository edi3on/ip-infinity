*all this code is Proof of Concept (PoC), in the future it will be majorly improved upon, i just needed to get the code working for now* 


# About
This is the backend server, meant to integrate all our sponsors into our game.
The code is very basic right now, not meant for official deployment.

# Sponsors
- Story Protocol: story.foundation
- Polygon: polygon.technology
- Skale: skale.space
- RootStock: rootstock.io

# Server Endpoints
- /mint : This endpoint is for minting a new NFT along with an IPA based on the original NFT for our game. (story protocol)
- /updateLicense : This endpoint is meant for changing an IPA's license, when a player would like to allow their IP to be used commercially (story protocol)
- /mintLicense : This endpoint is meant for when others would like to purchase a license for anothers IPA (story protocol)
- /getRevenue : This endpoint is meant for when people would like to see how much revenue they have made off royalties (story protocol)
- /claimRevenue : This endpoint is meant for when users want to claim their revenue from royalties (story protocol)
- /giverep : This endpoint is meant to transfer our ERC-20 reputation tokens to the users wallet (Skale, Polygon, Rootstock, Story)

  # Quick Start
  - install metmask, or a wallet of your choice and save the private key
  - install npm
  - clone the repo
  - open a cmd prompt, and navigate to the folder of the server
  - run "npm install"
  - next get smart.sol from ./scripts/utils/contracts/smart.sol
  - after customizing your coin details Deploy the smart contract on Remix IDE
  - You need to deploy it on the story, rootstock, polygon, and skale testnets
  - after deployment grab the token contract addresses for each
  - grab yourself a pinata.cloud JWT api key
  - get yourself an alchemy api key
  - next run "npm run create-collection" after editing ./scripts/utils/createSpsNftCollection.ts
  - save the address of the collection outputted in consol
  - next fill out your .env from .env example
  - to run the server run "npm run dev" in cmd


