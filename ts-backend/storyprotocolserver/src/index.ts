// express server to be called and mint nfts

import express from 'express';


import { main as nftContract } from '../scripts/metadatav2';
import { main as attachLicense } from '../scripts/attachLicense'
import { getClaimableRevenue  } from '../scripts/royaltyModule'
import { claimRevenue } from '../scripts/royaltyModule'
import { main as mintLicense} from '../scripts/mintLicense'
import { sendPolyErc20Token, sendStoryErc20Token } from '../scripts/sendToken';
 

const app = express();
const port = 5050;

// this code works, but it still unfinished will improve on in the future, this is just for PoC

app.post('/mint/:image_link/:title/:description/:attributes', async (req: express.Request, res: express.Response) => {
    console.log('minting nft');
    const {image_link, title, description, attributes } = req.params;

    // Parse attributes from JSON string to object
    const parsedAttributes = JSON.parse(attributes);

    const result = await nftContract(image_link, title, description, parsedAttributes);
    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    res.send(serializedResult);
});


app.get('/updateLicense/:ipa/:pilType/:mintingFee/:revShare', async (req, res) => { 
    console.log('updating license');
    const ipa = req.params.ipa as string;
    const pilType = req.params.pilType as string; // either cu or cr
    const mintingFee = parseFloat(req.params.mintingFee);
    const revShare = parseFloat(req.params.revShare) || 0;
    
    await attachLicense(ipa, mintingFee, pilType, revShare);
    
    res.send('attached');
});

app.get('/giverep/:ens/:amount', async (req, res) =>{
    console.log('giving rep');
    const ens = req.params.ens as string;
    const amount = parseFloat(req.params.amount);
    await sendStoryErc20Token(ens, amount);
    await sendPolyErc20Token(ens, amount);
    res.send('rep given');
});

app.get('/mintLicense/:ipa/:ens/:type', async (req, res) => {
    console.log('minting license');
    const ipa = req.params.ipa as `0x${string}`;
    const ens = req.params.ens as `0x${string}`;
    const LicenseTermsIdnum = parseInt(req.params.type);
    const minted = await mintLicense(ipa, LicenseTermsIdnum ,ens);
    res.send(minted);
});

app.get('/getRevenue/:ipa/:ens', async (req, res) => {
    console.log('getting revenue');
    const ipa = req.params.ipa as `0x${string}`;
    const ownerAddress = req.params.ens as `0x${string}`;
    const revenue = await getClaimableRevenue(ipa, ownerAddress); //will improve this code overall, with better responses
    res.send(revenue);
}); 

app.get('/claimRevenue/:ipa/:ens', async (req, res) => {
    console.log('claiming revenue');
    const ipa = req.params.ipa as `0x${string}`;
    const ownerAddress = req.params.ens as `0x${string}`;
    await claimRevenue(ipa, ownerAddress);
    res.send('revenue claimed');
});

app.get('/testRep', async (req, res) =>{
    console.log('testing rep');
    await sendStoryErc20Token("0x095AcC53402C38CC4dDBae513b0E93fb5ada4b75", 10);
    res.send('rep tested');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
