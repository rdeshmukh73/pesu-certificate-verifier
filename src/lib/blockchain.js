import { ethers } from "ethers";

export const RPC_URL =
  "https://rpc-amoy.polygon.technology";

export const CONTRACT_ADDRESS =
  "0x920a5BF584eD9CCd0450f42e21a9308e6A52d337";

export const ISSUER_WALLET =
  "0xc12eeFD4c72469C3f383716a4a158ccfCd9464Ee";

export const provider = new ethers.JsonRpcProvider(RPC_URL);