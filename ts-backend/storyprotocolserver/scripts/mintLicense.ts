import { StoryClient, StoryConfig, IpMetadata, PIL_TYPE } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'

export const main = async function createNFT() {
    const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
    const account: Account = privateKeyToAccount(privateKey)

    const config: StoryConfig = {  
        account: account,  
        transport: http(process.env.RPC_PROVIDER_URL),  
        chainId: 'iliad',  
    }  
    const client = StoryClient.newClient(config)

    const response = await client.license.mintLicenseTokens({
        licenseTermsId: "15", 
        licensorIpId: "0x4cdB515Be51F1af2d95d952e6990918f302a1E44",
        receiver: "0xF2Be153102d2630cA48E93aaC56f3b6E1AfF5083", 
        amount: 1, 
        txOptions: { waitForTransaction: true }
     });
     
    console.log(`License Token minted at transaction hash ${response.txHash}, License IDs: ${response.licenseTokenIds}`)
}
main()



