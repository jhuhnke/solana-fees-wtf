import { Connection, PublicKey } from '@solana/web3.js';

const rpcEndpoint = 'https://api.mainnet-beta.solana.com';

export async function getTotalFeesPaid(walletAddress: string) {
  const connection = new Connection(rpcEndpoint, 'confirmed');

  try {
    const publicKey = new PublicKey(walletAddress);
    
    // Get confirmed signatures for the wallet address
    const signatures = await connection.getConfirmedSignaturesForAddress2(publicKey);

    let totalFees = 0;
    
    // Iterate through signatures and fetch transaction info
    for (const signature of signatures) {
      const transactionInfo = await connection.getConfirmedTransaction(signature.signature);
      
      // Calculate total fees
      if (transactionInfo.meta && transactionInfo.meta.fee) {
        totalFees += transactionInfo.meta.fee;
      }
    }

    console.log(`Total fees paid by the wallet: ${totalFees} lamports`);
  } catch (error) {
    console.error('Error:', error);
  }
}