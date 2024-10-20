*all this code is Proof of Concept (PoC), in the future it will be majorly improved upon, i just needed to get the code working for now* 

*further documentation about code can be found <notion link> here*

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
- /giverep : Thsi endpoint is meant to transfer our ERC-20 reputation tokens to the users wallet (Skale, Polygon, Rootstock, Story)


