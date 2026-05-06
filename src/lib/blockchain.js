import { ethers } from "ethers";

//export const RPC_URL =
//  "https://rpc-amoy.polygon.technology";
export const RPC_URL = 
  "https://rpc.ankr.com/polygon/90e58f51361b1f172be09abaeb7416021a21267538d1a419c5e47a9445521fa3";

export const CONTRACT_ADDRESS =
  "0xD2AE4b1b61a0315a1A2Ed1DB0b0Ff9a58595cBe5"; //The Mainnet contract address
  //"0x920a5BF584eD9CCd0450f42e21a9308e6A52d337"; //The Amoy testnet contract address

export const ISSUER_WALLET =
  "0x046E714a24f98a06A40fdD1771Ab977842A7f6F2"; //The wallet address of the issuer on Mainnet
  //"0xc12eeFD4c72469C3f383716a4a158ccfCd9464Ee"; //The older wallet address on Amoy testnet

export const provider = new ethers.JsonRpcProvider(RPC_URL);