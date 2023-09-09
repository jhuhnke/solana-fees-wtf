import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../stylesheets/ResultScreen.css'

interface ResultScreenProps {
  totalFees: number | null;
  transactionCount: number | null;
  ethGasPrice: number | null;
  walletAddress: string;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  totalFees,
  transactionCount,
  ethGasPrice,
  walletAddress,
}) => {
  const [solanaPrice, setSolanaPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [ethGasPaid, setEthGasPaid] = useState<number | null>(null);
  const [solGasPaid, setSolGasPaid] = useState<number | null>(null);
  const [gasDifference, setGasDifference] = useState<number | null>(null);

useEffect(() => {
    // Fetch the current price of Solana from CoinGecko API
    async function fetchSolanaPrice() {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'solana',
            vs_currencies: 'usd',
          },
        });
        setSolanaPrice(response.data.solana.usd);
      } catch (error) {
        console.error('Error fetching Solana price:', error);
      }
    }

    fetchSolanaPrice();
  }, []);

  useEffect(() => {
    // Get ETH Price
    async function fetchEthPrice() {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'ethereum',
            vs_currencies: 'usd',
          },
        });
        setEthPrice(response.data.ethereum.usd);
      } catch (error) {
        console.error('Error fetching Ethereum price:', error);
      }
    }

    fetchEthPrice();
  }, []);

  useEffect(() => {
    if (transactionCount !== null && ethGasPrice !== null && solanaPrice !== null && ethPrice !== null) {
    const ethGasPaidUSD = (transactionCount * ethGasPrice * 10 ** -9) * ethPrice;
    const solGasPaidUSD = (totalFees !== null ? totalFees / 10 ** 9 * solanaPrice : 0);
    const difference = ethGasPaidUSD - solGasPaidUSD;

      setEthGasPaid(ethGasPaidUSD);
      setSolGasPaid(solGasPaidUSD);
      setGasDifference(difference);
    }
  }, [transactionCount, ethGasPrice, solanaPrice, totalFees, ethPrice]);


  return (
    <div className = 'container'>
      <div className="center">
      <div>
        <p>
          <a href= {`https://solscan.io/account/${walletAddress}`} target="_blank" rel="noopener noreferrer"> {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}</a> has spent <span className='output'>{totalFees !== null ? (totalFees / 10 ** 9).toFixed(4) : 'N/A'}</span> SOL on fees to send <span className='output'>{' '}{transactionCount !== null ? transactionCount : 'N/A'} </span>transactions.
        </p>
        {solanaPrice !== null && (
          <p>Right now, that is worth <span className='output'>${(totalFees !== null ? totalFees / 10 ** 9 * solanaPrice : 0).toFixed(4)}</span></p>
        )}
        {ethGasPrice && (
          <p>
            Estimated cost in ETH:
            <span className='output'>{' '}
            {transactionCount !== null && ethGasPrice !== null
              ? (transactionCount * ethGasPrice).toFixed(4)
              : 'N/A'}{' '}</span>
            GWEI
          </p>
        )}
        {ethGasPrice && solanaPrice !== null && ethPrice !== null && (
          <p>
          Sending <span className='output'>{' '}
          {transactionCount !== null ? transactionCount : 'N/A'}</span> transactions on ETH mainnet currently costs <span className='output'>$
            {transactionCount !== null && ethGasPrice !== null
              ? ((transactionCount * ethGasPrice * 10 ** -9) * ethPrice).toFixed(2)
              : 'N/A'} </span>
          </p>
        )}
        {ethGasPaid !== null && solGasPaid !== null && (
          <p>
            This wallet has saved <span className='output'>${gasDifference !== null ? gasDifference.toFixed(2) : 'N/A'}</span> by using Solana
          </p>
        )}
          <div className='buttons'>
            <button onClick={() => (window.location.href = '/')}>Reset</button>
          </div>
      </div>
    </div>
    </div>
  );
};

export default ResultScreen;