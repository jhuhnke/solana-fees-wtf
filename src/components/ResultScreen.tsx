import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import '../stylesheets/ResultScreen.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { mintNFT } from '../queries/mint-nft'; // Make sure the path is correct

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
  const [isMinting, setIsMinting] = useState(false);

  // Use the wallet from the useWallet hook
  const { wallet } = useWallet();

  // Define a state variable to store the captured image data URL
  const [capturedImageDataUrl, setCapturedImageDataUrl] = useState<string | null>(null);

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

const handleMintNFT = async () => {
    setIsMinting(true);

    const resultScreen = document.getElementById('result-screen');
    if (!resultScreen) {
      console.error('Result screen not found.');
      setIsMinting(false);
      return;
    }

    try {
      const canvas = await html2canvas(resultScreen);
      const imgDataUrl = canvas.toDataURL('image/png');
      setCapturedImageDataUrl(imgDataUrl);

      // Adjusted the function call here to match the helper function's parameter requirements
      await mintNFT(imgDataUrl, totalFees, transactionCount, wallet?.adapter ?? null);
      console.log('NFT Minted Successfully!'); // Handle success as you see fit
    } catch (error) {
      console.error('Error:', error); // Handle the error, perhaps by showing an error message to the user.
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="container" id="result-screen">
      <div className="center">
        <div>
          <p>
            <a href={`https://solscan.io/account/${walletAddress}`} target="_blank" rel="noopener noreferrer">
              {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
            </a>{' '}
            has spent{' '}
            <span className="output">
              {totalFees !== null ? (totalFees / 10 ** 9).toFixed(4) : 'N/A'}
            </span>{' '}
            SOL on fees to send{' '}
            <span className="output">
              {' '}
              {transactionCount !== null ? transactionCount : 'N/A'}{' '}
            </span>
            transactions.
          </p>
          {solanaPrice !== null && (
            <p>
              Right now, that is worth{' '}
              <span className="output">
                ${(totalFees !== null ? (totalFees / 10 ** 9) * solanaPrice : 0).toFixed(4)}
              </span>
            </p>
          )}
          {ethGasPrice && (
            <p>
              Estimated cost in ETH:
              <span className="output">
                {' '}
                {transactionCount !== null && ethGasPrice !== null
                  ? (transactionCount * ethGasPrice).toFixed(4)
                  : 'N/A'}{' '}
              </span>
              GWEI
            </p>
          )}
          {ethGasPrice && solanaPrice !== null && ethPrice !== null && (
            <p>
              Sending{' '}
              <span className="output">{' '}
              {transactionCount !== null ? transactionCount : 'N/A'}
              </span> transactions on ETH mainnet currently costs{' '}
              <span className="output">
                ${transactionCount !== null && ethGasPrice !== null
                  ? ((transactionCount * ethGasPrice * 10 ** -9) * ethPrice).toFixed(2)
                  : 'N/A'}{' '}
              </span>
            </p>
          )}
          {ethGasPaid !== null && solGasPaid !== null && (
            <p>
              This wallet has saved{' '}
              <span className="output">${gasDifference !== null ? gasDifference.toFixed(2) : 'N/A'}</span> by using Solana
            </p>
          )}
          <div className="buttons">
            <button onClick={() => (window.location.href = '/')}>Reset</button>
            <button onClick={handleMintNFT} disabled={isMinting}>
              {isMinting ? 'Minting...' : 'Mint NFT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;