import { StoryClient, StoryConfig, IpMetadata, PIL_TYPE } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'
import { toHex } from 'viem';


export const main = async function createNFT(contract: string, tokenId: number, imageLink: string, title: string, description: string, attributes: any[], ownerAddress: string) {
    const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
    const account: Account = privateKeyToAccount(privateKey)

    const config: StoryConfig = {  
        account: account,  
        transport: http(process.env.RPC_PROVIDER_URL),  
        chainId: 'iliad',  
    }  
    const client = StoryClient.newClient(config)

    const ipMetadata = client.ipAsset.generateIpMetadata({
        title: title,
        description: description,
        watermarkImg: imageLink,
        attributes: attributes
    })

    const nftMetadata = {
        name: title,
        description: description,
        image: imageLink
    }

    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(ipIpfsHash).digest('hex')

    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(nftIpfsHash).digest('hex')

    const response = await client.ipAsset.register({
        nftContract: contract as Address,
        tokenId: tokenId.toString(),
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true }
      });

    console.log('Root IPA created at transaction hash: ', response.txHash)
    console.log('Root IPA ID: ', response.ipId)
    console.log('view on explorer: https://explorer.story.foundation/ipa/' + response.ipId)
    return response
    
}




