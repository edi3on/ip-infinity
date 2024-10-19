import { AddressZero, IpMetadata, PIL_TYPE, RegisterIpAndAttachPilTermsResponse, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { Address, Account, privateKeyToAccount } from 'viem/accounts'

import dotenv from 'dotenv';
dotenv.config();

const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
const account: Account = privateKeyToAccount(privateKey)


export const main = async function (amount: number, revShare: number, type: string) {

    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)
    const merc20 = 'B132A6B7AE652c974EE1557A3521D53d18F6739f'
    if (type == 'cu') {
        const response = await client.license.registerCommercialUsePIL({
            currency: `0x${merc20}`,
            defaultMintingFee: amount.toString(),
            txOptions: { waitForTransaction: true }
        });
        console.log(`PIL Terms registered at transaction hash ${response.txHash}, License Terms ID: ${response.licenseTermsId}`) 
        return response.licenseTermsId?.toString()
    } else {

        const response = await client.license.registerCommercialRemixPIL({
            currency: `0x${merc20}`, // Add the "0x" prefix
            defaultMintingFee: amount.toString(),
            commercialRevShare: revShare,
            txOptions: { waitForTransaction: true }
        });
        console.log(`PIL Terms registered at transaction hash ${response.txHash}, License Terms ID: ${response.licenseTermsId}`) 
        return response.licenseTermsId?.toString()
    }
      
      
    
}

