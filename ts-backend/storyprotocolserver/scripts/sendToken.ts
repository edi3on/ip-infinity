import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

// Load environment variables from .env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
const POLY_TOKEN_CONTRACT_ADDRESS = process.env.POLY_TOKEN_CONTRACT_ADDRESS;
const SKALE_TOKEN_CONTRACT_ADDRESS = process.env.SKALE_TOKEN_CONTRACT_ADDRESS;
const ROOT_STOCK_CONTRACT_ADDRESS = process.env.ROOTSTOCK_TOKEN_CONTRACT_ADDRESS;



// ERC-20 Token ABI
const tokenAbi = [
  "function transfer(address to, uint amount) public returns (bool)",
];

export const sendStoryErc20Token = async (reciepint: string, amount: number, ) => {
  const provider = new ethers.JsonRpcProvider(`https://testnet.storyrpc.io`);
  const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider);
  try {
    const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS as string, tokenAbi, wallet);
    const decimals = 2;
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

    console.log("Sending transaction...");
    const transaction = await tokenContract.transfer(reciepint, parsedAmount);

    console.log("Waiting for transaction confirmation...");
    const receipt = await transaction.wait();

    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error sending token:", error);
  }
};

export const sendPolyErc20Token = async (reciepint: string, amount: number, ) => {
  const provider = new ethers.JsonRpcProvider(`https://rpc-amoy.polygon.technology/`);
  const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider);  
  try {
    const tokenContract = new ethers.Contract(POLY_TOKEN_CONTRACT_ADDRESS as string, tokenAbi, wallet);
    const decimals = 2;
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

    console.log("Sending transaction...");
    const transaction = await tokenContract.transfer(reciepint, parsedAmount);

    console.log("Waiting for transaction confirmation...");
    const receipt = await transaction.wait();

    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error sending token:", error);
  }
};

export const sendSkaleErc20Token = async (reciepint: string, amount: number, ) => {
  const provider = new ethers.JsonRpcProvider(`https://testnet.skalenodes.com/v1/giant-half-dual-testnet`);
  const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider);
  try {
    const tokenContract = new ethers.Contract(SKALE_TOKEN_CONTRACT_ADDRESS as string, tokenAbi, wallet);
    const decimals = 2;
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

    console.log("Sending transaction...");
    const transaction = await tokenContract.transfer(reciepint, parsedAmount);

    console.log("Waiting for transaction confirmation...");
    const receipt = await transaction.wait();

    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error sending token:", error);
  }
};

export const sendRSErc20Token = async (reciepint: string, amount: number, ) => {
  const provider = new ethers.JsonRpcProvider(`https://public-node.testnet.rsk.co`);
  const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider);
  try {
    const tokenContract = new ethers.Contract(ROOT_STOCK_CONTRACT_ADDRESS as string, tokenAbi, wallet);
    const decimals = 2;
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

    console.log("Sending transaction...");
    const transaction = await tokenContract.transfer(reciepint, parsedAmount);

    console.log("Waiting for transaction confirmation...");
    const receipt = await transaction.wait();

    console.log("Transaction confirmed:", receipt);
  } catch (error) {
    console.error("Error sending token:", error);
  }
};
