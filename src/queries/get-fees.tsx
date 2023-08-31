// queries/get-fees.ts
import { Connection, PublicKey } from '@solana/web3.js';

const rpcEndpoint = 'https://rpc.helius.xyz/?api-key=2cc4df26-0576-4fb8-ac07-09b40e812657';

export async function getTotalFeesPaid(walletAddress: string) {
  const connection = new Connection(rpcEndpoint, 'confirmed');

  try {
    const publicKey = new PublicKey(walletAddress);

    // Get confirmed signatures for the wallet address
    const signatures = await connection.getSignaturesForAddress(publicKey);

    let totalFees = 0;
    let transactionCount = 0;

    // Iterate through signatures and fetch transaction info
    for (const signatureInfo of signatures) {
      const signature = signatureInfo.signature;

      // Get transaction info using the signature
      const transactionInfoResponse = await connection.getTransaction(signature);

      if (transactionInfoResponse.result) {
        // Calculate total fees
        const fee = transactionInfoResponse.result.meta.fee;
        totalFees += fee;

        // Increment transaction count
        transactionCount++;
      }
    }

    return { totalFees, transactionCount }; // Return total fees and transaction count
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}


