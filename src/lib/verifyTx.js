import { provider, CONTRACT_ADDRESS, ISSUER_WALLET } from "./blockchain";

function extractIPFSFromLogs(receipt) {

  for (const log of receipt.logs) {

    try {

      const hexData = log.data;

      const text = Buffer.from(hexData.replace(/^0x/, ""), "hex").toString();

      if (text.includes("ipfs://")) {

        const match = text.match(/ipfs:\/\/[a-zA-Z0-9]+/);

        if (match) {
          return match[0];
        }

      }

    } catch (err) {}

  }

  return null;
}

export async function verifyTransaction(txHash) {

  try {

    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return { valid: false, reason: "Transaction not found" };
    }

    const receipt = await provider.getTransactionReceipt(txHash);

    if (receipt.status !== 1) {
      return { valid: false, reason: "Transaction failed" };
    }

    if (tx.to.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
      return { valid: false, reason: "Wrong contract address" };
    }

    if (tx.from.toLowerCase() !== ISSUER_WALLET.toLowerCase()) {
      return { valid: false, reason: "Wrong issuer wallet" };
    }

    const ipfsURI = extractIPFSFromLogs(receipt);
    console.log("===== CERTIFICATE DEBUG =====");
    console.log("Transaction:", txHash);
    console.log("Extracted IPFS URI:", ipfsURI);
    console.log("=============================");
    
    return {
      valid: true,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      ipfsURI
    };

  } catch (err) {

    return { valid: false, reason: "Verification error" };

  }

}