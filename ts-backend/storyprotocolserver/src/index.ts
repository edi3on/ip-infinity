// express server to be called and mint nfts

import express from 'express';
import { ethers } from 'ethers';
import { main as nftContract } from '../scripts/metadatav2';
import { sendErc20Token } from '../scripts/sendToken';
import { main as attachLicense } from '../scripts/attachLicense'
let nftJson: any;
let image_link: string;
let title: string;
let description: string;
let attributes: any;
let result: any;
let tokenId: number;
let contract: string;   

const app = express();
const port = 5050;

app.get('/mint', async (req, res) => {
    nftJson = req.body
    //console.log(nftJson)
    image_link = nftJson[0].metadata.image
    title = nftJson[0].metadata.name
    description = nftJson[0].metadata.description
    attributes = nftJson[0].metadata.attributes
    tokenId = nftJson[0].metadata.token_id
    contract = nftJson[0].contract.address
    const address = nftJson[0].contract.ens


    result = await nftContract(contract, tokenId, image_link, title, description, attributes, address) 
    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
    res.send(serializedResult)

});




app.post('/royalties', async (req, res) => {
    const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    //VERY VERY SIMPLE AUTHENTICATION, I KNOW ITS NOT SECURE AT ALL
    const ipa_address = req.body.ipa_address as string;
    const amount = req.body.amount as number;
    const adding = req.body.adding as boolean;
    if (ip_address != '0.0.0.0') {
        res.send('unauthorized');
    }

});

app.get('/sendcoin', async (req, res) => { //only for testing
    const amount = 1000;
    const address = '0xDa2e0b8bFD702F9cF81B8dFf5F064e7405acf754';
    sendErc20Token();
    res.send('sent');
    
    
});

app.get('/updateLicense', async (req, res) => { 
    const ipa = req.body.ipa_address as string;
    const pilType = req.body.pil_type as string; // either cu or cr
    const mintingFee = req.body.minting_fee as number;
    const revShare = req.body.rev_share as number || 0;
    attachLicense(ipa, mintingFee, pilType, revShare)
    
    res.send('attached lil bro');
});

// Quick curl command for testing:
// curl -X POST -H "Content-Type: application/json" -d '{"amount": 100, "address": "0x1234567890123456789012345678901234567890"}' http://localhost:5050/sendcoin

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
