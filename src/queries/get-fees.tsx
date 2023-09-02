import { Connection, PublicKey } from '@solana/web3.js';
import { fetchEthGasPrice } from './get-eth-gas'; // Import the function from the new file

const rpcEndpoint = 'https://rpc.helius.xyz/?api-key=2cc4df26-0576-4fb8-ac07-09b40e812657';

export async function getTotalFeesPaid(walletAddress: string) {
  const connection = new Connection(rpcEndpoint, 'confirmed');

  try {
    const publicKey = new PublicKey(walletAddress);

    const signatures = await connection.getSignaturesForAddress(publicKey);

    let totalFees = 0;
    let transactionCount = 0;

    for (const signatureInfo of signatures) {
      const signature = signatureInfo.signature;

      const transactionInfoResponse = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (transactionInfoResponse && transactionInfoResponse.meta && transactionInfoResponse.meta.fee) {
        const fee = transactionInfoResponse.meta.fee;
        totalFees += fee;

        transactionCount++;
      }
    }

    // Get ETH gas prices using the imported function
    const ethGasPrice = await fetchEthGasPrice();

    return { totalFees, transactionCount, ethGasPrice };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}