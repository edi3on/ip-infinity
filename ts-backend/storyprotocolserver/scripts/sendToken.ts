import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

// Load environment variables from .env file
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
const RECEIVER_ADDRESS = "0xDa2e0b8bFD702F9cF81B8dFf5F064e7405acf754";
const AMOUNT = 10;

if (!INFURA_API_KEY || !PRIVATE_KEY || !TOKEN_CONTRACT_ADDRESS || !RECEIVER_ADDRESS || !AMOUNT) {
  throw new Error("Missing environment variables. Please check your .env file.");
}

const provider = new ethers.JsonRpcProvider(`https://testnet.storyrpc.io`);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ERC-20 Token ABI
const tokenAbi = [
  "function transfer(address to, uint amount) public returns (bool)",
];

export const sendErc20Token = async () => {
  try {
    const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, wallet);
    const decimals = 2;
    const parsedAmount = ethers.parseUnits(AMOUNT.toString(), decimals);

    console.log("Sending transaction...");
    const transaction = await tokenContract.transfer(RECEIVER_ADDRESS, parsedAmount);

    console.log("Waiting for transaction confirmation...");
    const receipt = await transaction.wait();

    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error sending token:", error);
  }
};

//not finished