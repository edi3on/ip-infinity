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


export const createDispute = async function (targetIpId: `0x${string}`, arbitrationPolicy: `0x${string}`, linkToDisputeEvidence: string, targetTag: string) {

    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)
    const response = await client.dispute.raiseDispute({targetIpId, arbitrationPolicy, linkToDisputeEvidence, targetTag, txOptions:{waitForTransaction: true}});
    console.log(`Dispute raised at transaction hash ${response.txHash}.`)
    return response

    /*request: The request object containing necessary data to raise a dispute.
    request.targetIpId: The IP ID that is the target of the dispute.
    request.arbitrationPolicy: The address of the arbitration policy.
    request.linkToDisputeEvidence: The link to the dispute evidence.
    request.targetTag: The target tag of the dispute.
    request.calldata: [Optional] Calldata to initialize the policy.
    request.txOptions: [Optional] The transaction options.*/
    
}

export const cancelDispute = async function (disputeId: string) {

    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)
    const response = await client.dispute.cancelDispute({disputeId, txOptions:{waitForTransaction: true}});
    return response;

    /*request: The request object containing details to cancel the dispute.
request.disputeId: The ID of the dispute to be cancelled.
request.calldata: [Optional] Additional data used in the cancellation process.
request.txOptions: [Optional] The transaction options.*/
    
}

export const resolveDispute = async function (disputeId: string, data:any) {

    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)
    const response = await client.dispute.resolveDispute({disputeId, data, txOptions:{waitForTransaction: true}});
    return response;

    /*request: The request object containing details to resolve the dispute.
request.disputeId: The ID of the dispute to be resolved.
request.data: The data to resolve the dispute.
request.txOptions: [Optional] The transaction options.*/
    
}

