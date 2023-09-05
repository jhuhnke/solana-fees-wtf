import React, { useState } from 'react'; 
import { useWallet } from '@solana/wallet-adapter-react';
import { getTotalFeesPaid } from "../queries/get-fees";
import LoadingScreen from './Loading';
import ResultScreen from './ResultScreen';
//import '../stylesheets/Home.css'

const Home = () => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [totalFees, setTotalFees] = useState<number | null>(null);
  const [transactionCount, setTransactionCount] = useState<number | null>(null);
  const [ethGasPrice, setEthGasPrice] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleGetTotalFees = async (address: string) => {
    setIsLoading(true);

    try {
      const { totalFees, transactionCount, ethGasPrice } = await getTotalFeesPaid(address);
      setTotalFees(totalFees);
      setTransactionCount(transactionCount);
      setEthGasPrice(ethGasPrice);
      setWalletAddress(address);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (totalFees !== null) {
    return (
      <ResultScreen 
        totalFees={totalFees} 
        transactionCount={transactionCount} 
        ethGasPrice={ethGasPrice} 
        walletAddress={walletAddress}
      />
    );
  }

  return (
    <div className="container">
      <div className="form">
        <h1>How much have you spent on fees?</h1>
        {wallet.connected ? (
          <>
            <h2>Connected Wallet Address:</h2>
            <p>{wallet.publicKey?.toString() || ''}</p>
          </>
        ) : (
          <>
            <h2>Connect Wallet</h2>
            <button onClick={() => wallet.connect()}>Connect Phantom Wallet</button>
            <button onClick={() => wallet.connect('backpack')}>Connect Backpack Wallet</button>
            <p>OR</p>
            <h2>Enter A Solana Address</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as HTMLFormElement;
                const address = (target.elements.namedItem("walletAddress") as HTMLInputElement)?.value;
                if (address) {
                  handleGetTotalFees(address);
                }
              }}
            >
              <input type="text" name="walletAddress" placeholder="Enter a wallet address" />
              <div className="buttons">
                <button type="submit">Submit</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;