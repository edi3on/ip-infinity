import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'

const main = async function () {
    const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
    const account: Account = privateKeyToAccount(privateKey)

    const config: StoryConfig = {
    account: account,
        transport: http(process.env.RPC_PROVIDER_URL),
        chainId: 'iliad',
    }

    const client = StoryClient.newClient(config)

    const newCollection = await client.nftClient.createNFTCollection({
        name: 'SIGMA NFT',
        symbol: 'SIGMA',
        txOptions: { waitForTransaction: true },
    })
    
    console.log(
        `New SPG NFT collection created at transaction hash ${newCollection.txHash}`, 
        `NFT contract address: ${newCollection.nftContract}`
    )
}

main()
