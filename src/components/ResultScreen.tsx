import React, { useEffect, useState } from 'react'; 
import axios from "axios"; 

interface ResultScreenProps {
    totalFees: number | null; 
    transactionCount: number | null;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ totalFees, transactionCount }) => {
const [solanaPrice, setSolanaPrice] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the current price of Solana from CoinGecko API
    async function fetchSolanaPrice() {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
          params: {
            ids: "solana",
            vs_currencies: "usd",
          },
        });
        setSolanaPrice(response.data.solana.usd);
      } catch (error) {
        console.error("Error fetching Solana price:", error);
      }
    }

    fetchSolanaPrice();
  }, []);

  return (
    <div className="result-screen">
      <h2>Results</h2>
      {totalFees !== null ? (
        <div>
          <p>Total fees paid: {totalFees / 10 ** 9} SOL for a total of {transactionCount} transactions.</p>
          {solanaPrice !== null && <p>Total fees in USD: ${(totalFees / 10 ** 9 * solanaPrice).toFixed(9)}</p>}
        </div>
      ) : (
        <p>No data available</p>
      )}
      <button onClick={() => window.location.href = "/"}>Reset</button>
    </div>
  );
};

export default ResultScreen;