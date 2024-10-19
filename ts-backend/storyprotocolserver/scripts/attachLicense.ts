import { AddressZero, IpMetadata, PIL_TYPE, RegisterIpAndAttachPilTermsResponse, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'
import { Address, Account, privateKeyToAccount } from 'viem/accounts'
import { main as createLicense } from './createLicense'

import dotenv from 'dotenv';
dotenv.config();
const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
const account: Account = privateKeyToAccount(privateKey)


export const main = async function (ipId: string, amount: number, type: string, revShare: number) {

    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)
    let licenseTermsId: any;
    if (type == 'cu') {
        licenseTermsId = await createLicense(amount, 0, type)
    } else {
        licenseTermsId = await createLicense(amount, revShare, type)
    }

    const response = await client.license.attachLicenseTerms({
        licenseTermsId: licenseTermsId.toString(), 
        ipId: `0x${ipId}`,
        txOptions: { waitForTransaction: true }
      });
      
      if (response.success) {
        console.log(`Attached License Terms to IPA at transaction hash ${response.txHash}.`)
      } else {
        console.log(`License Terms already attached to this IPA.`)
      }
}

