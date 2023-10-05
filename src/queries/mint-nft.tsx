import { Connection, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import { format } from 'date-fns';
import { Metaplex, bundlrStorage, toMetaplexFile, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Buffer } from 'buffer';
import { WalletAdapter } from "@solana/wallet-adapter-base";

async function createMetadata(imageDataUrl: string, metaplex: Metaplex, wallet: WalletAdapter, totalFees: number, transactionCount: number) {
  const currentTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");

  const metadataURI = await metaplex.nfts().uploadMetadata({
    name: "F(R)EE",
    description: "How much you have spent on fees using Solana",
    image: await toMetaplexFile(Buffer.from(imageDataUrl.split("base64,")[1], "base64"), "heliusLogo"),
    attributes: [
      { name: "Transactions", value: transactionCount?.toString() },
      { name: "Total Fees", value: totalFees?.toString() },
      { name: "Time", value: currentTime },
    ],
  });
  return metadataURI;
}

export async function mintNFT(
    imgDataUrl: string,
    totalFees: number | null,
    transactionCount: number | null,
    wallet: WalletAdapter | null
) {
    try {
        if (!wallet || !wallet.connected) {
            throw new Error('No wallet connected.');
        }

        const connection = new Connection(
            "https://rpc.helius.xyz/?api-key=2cc4df26-0576-4fb8-ac07-09b40e812657",
            "confirmed"
        );

        const metaplex = Metaplex.make(connection)
            .use(walletAdapterIdentity(wallet))
            .use(bundlrStorage());

        const recipientAddress = new PublicKey("H7v9VWFRjbhbzPkjxnbEgTXQPYQGU54vyhKqqnmWc3PN");
        console.log(typeof recipientAddress)
        console.log(recipientAddress);

        if (!wallet.publicKey) {
            throw new Error('Wallet public key is null');
        }

        const mintingFee = 0.25;
        const balance = await connection.getBalance(wallet.publicKey);
        const feeInLamports = mintingFee * 1000000000;

        if (balance < feeInLamports) {
            throw new Error("Insufficient balance to mint the NFT.");
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: recipientAddress,
                lamports: feeInLamports,
            })
        );

        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = latestBlockhash.blockhash;

        // Sign the transaction using the wallet
       const signature = await wallet.sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'processed')

        if (signature) {
            if (totalFees !== null && transactionCount !== null) {
                const metadata = await createMetadata(imgDataUrl, metaplex, wallet, totalFees, transactionCount);
                console.log('Metadata Created');

                const nft = await metaplex.nfts().create({
                  uri: metadata.uri, 
                  name: "F(R)EE", 
                  sellerFeeBasisPoints: 500, 
                  creators: [{ address: wallet.publicKey, share: 100 }], // Fixed creator type
                });

                console.log("NFT:", nft.mintAddress.toBase58());
                return nft.mintAddress.toBase58();
            } else {
                throw new Error("totalFees or transactionCount is null");
            }
        } else {
            throw new Error("Transaction failed.");
        }
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
}
