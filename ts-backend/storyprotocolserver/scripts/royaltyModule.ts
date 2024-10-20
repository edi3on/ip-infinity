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

// this is all test not to be used 
export const test = async function () {

    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)
    const royaltyVaultIpId: `0x${string}` = '0x4cdB515Be51F1af2d95d952e6990918f302a1E44'; // Replace with the actual ID
   //const response = await client.royalty.getRoyaltyVaultAddress(royaltyVaultIpId);
   // console.log('Royalty Vault Address: ', response);
    const response = await client.royalty.getRoyaltyVaultAddress(royaltyVaultIpId);
    console.log('Royalty Vault Address: ', response);
    const snapshotRequest = { royaltyVaultIpId, txOptions: { waitForTransaction: true } };
    const response2 = await client.royalty.snapshot(snapshotRequest);
    console.log('Snapshot completed: ', response2);
    const snapshotID = response2.snapshotId;
    if (snapshotID === undefined) {
        throw new Error('Snapshot ID is undefined');
    }
    const response3 = await client.royalty.claimableRevenue({
        royaltyVaultIpId,
        account: "0x4cdB515Be51F1af2d95d952e6990918f302a1E44",
        snapshotId: snapshotID,
        token: "0x91f6f05b08c16769d3c85867548615d270c42fc7"
    });
    console.log('Claimable Revenue: ', response3);


}

export const getClaimableRevenue = async function (royaltyVaultIpId: `0x${string}`, ownerAddress: `0x${string}`) {
    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)
    const snapshotRequest = { royaltyVaultIpId, txOptions: { waitForTransaction: true } };
    const response2 = await client.royalty.snapshot(snapshotRequest);
    console.log('Snapshot completed: ', response2);
    const snapshotID = response2.snapshotId;
    if (snapshotID === undefined) {
        throw new Error('Snapshot ID is undefined');
    }
    const response3 = await client.royalty.claimableRevenue({
        royaltyVaultIpId,
        account: ownerAddress,
        snapshotId: snapshotID,
        token: "0x91f6f05b08c16769d3c85867548615d270c42fc7"
    });
    console.log('Claimable Revenue: ', response3);
    return response3
}

export const claimRevenue = async function(royaltyVaultIpId: `0x${string}`, ownerAddress: `0x${string}`){
    const config: StoryConfig = {
        account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }
    const client = StoryClient.newClient(config)
    const snapshotRequest = { royaltyVaultIpId, txOptions: { waitForTransaction: true } };
    const snapresponse = await client.royalty.snapshot(snapshotRequest)
    if (snapresponse.snapshotId === undefined) {
        throw new Error('Snapshot ID is undefined');
    }
    const response = await client.royalty.claimRevenue({
        snapshotIds: [snapresponse.snapshotId],
        royaltyVaultIpId,
        account: ownerAddress,
        token: "0x91f6f05b08c16769d3c85867548615d270c42fc7"

    });
    return response

}
