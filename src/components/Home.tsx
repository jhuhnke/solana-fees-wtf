import React, { useState } from 'react'; 
import { getTotalFeesPaid } from "../queries/get-fees";
import LoadingScreen from './Loading';
import ResultScreen from './ResultScreen';

const Home = ({ onSubmit }: { onSubmit: (input: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalFees, setTotalFees] = useState<number | null>(null);

  const handleGetTotalFees = async (walletAddress: string) => {
    setIsLoading(true);

    try {
      const { totalFees } = await getTotalFeesPaid(walletAddress);
      setTotalFees(totalFees); // Set the fees directly as a number
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
    return <ResultScreen totalFees={totalFees} />;
  }

  return (
    <div className="container">
      <div className="form">
        <h2>Enter A Solana Address</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const walletAddress = target.elements.namedItem("walletAddress")?.value;
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