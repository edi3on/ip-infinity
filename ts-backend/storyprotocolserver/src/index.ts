
import express from 'express';


import { main as nftContract } from '../scripts/metadatav2';
import { main as attachLicense } from '../scripts/attachLicense'
import { getClaimableRevenue  } from '../scripts/royaltyModule'
import { claimRevenue } from '../scripts/royaltyModule'
import { main as mintLicense} from '../scripts/mintLicense'



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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
