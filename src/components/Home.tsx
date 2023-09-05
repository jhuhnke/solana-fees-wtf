import React, { useState } from 'react'; 
import { getTotalFeesPaid } from "../queries/get-fees";
import LoadingScreen from './Loading';
import ResultScreen from './ResultScreen';
//import '../stylesheets/Home.css'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalFees, setTotalFees] = useState<number | null>(null);
  const [transactionCount, setTransactionCount] = useState<number | null>(null);
  const [ethGasPrice, setEthGasPrice] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleGetTotalFees = async (walletAddress: string) => {
  setIsLoading(true);

  try {
    const { totalFees, transactionCount, ethGasPrice } = await getTotalFeesPaid(walletAddress);
    setTotalFees(totalFees);
    setTransactionCount(transactionCount);
    setEthGasPrice(ethGasPrice);
    setWalletAddress(walletAddress);
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
    return <ResultScreen 
              totalFees={totalFees} 
              transactionCount = {transactionCount} 
              ethGasPrice={ethGasPrice} 
              walletAddress={walletAddress}
            />;
  }

  return (
    <div className="container">
      <div className="form">
        <h2>Enter A Solana Address</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const walletAddress = (target.elements.namedItem("walletAddress") as HTMLInputElement)?.value;
            if (walletAddress) {
              handleGetTotalFees(walletAddress);
            }
          }}
        >
          <input type="text" name="walletAddress" />
          <div className="buttons">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home; 