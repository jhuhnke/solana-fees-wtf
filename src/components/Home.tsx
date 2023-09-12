import React, { FC, useState } from 'react';
import { getTotalFeesPaid } from '../queries/get-fees';
import LoadingScreen from './Loading';
import ResultScreen from './ResultScreen';
import WalletConnect from './WalletConnect';
import '../stylesheets/Home.css';

const Home: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [totalFees, setTotalFees] = useState<number | null>(null);
    const [transactionCount, setTransactionCount] = useState<number | null>(null);
    const [ethGasPrice, setEthGasPrice] = useState<number | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null); // Use null instead of an empty string
    const [isWalletConnected, setIsWalletConnected] = useState(false); // Track wallet connection

    const handleGetTotalFees = async (address: string) => {
        setIsLoading(true);

        try {
            const { totalFees, transactionCount, ethGasPrice } = await getTotalFeesPaid(address);
            setTotalFees(totalFees);
            setTransactionCount(transactionCount);
            setEthGasPrice(ethGasPrice);
            setWalletAddress(address);
            setIsWalletConnected(true); // Set wallet connected to true
        } catch (error) {
            console.error('Error:', error);
            setIsWalletConnected(false); // Set wallet connected to false on error
        } finally {
            setIsLoading(false);
        }
    };

    // Callback function to update walletAddress when the wallet is connected
    const handleWalletConnected = (address: string) => {
        setWalletAddress(address);
        setIsWalletConnected(true); // Set wallet connected to true
    };

    // Callback function to handle disconnecting the wallet
    const handleDisconnect = () => {
        setWalletAddress(null); // Clear the wallet address
        setIsWalletConnected(false); // Set wallet connected to false
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (walletAddress) {
            handleGetTotalFees(walletAddress);
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
                walletAddress={walletAddress || ''}
            />
        );
    }

    return (
        <div className="container">
            <div className="form">
                <h1>How much have you spent on fees?</h1>
                <h2>First Connect Your Solana Wallet</h2>
                <div className='button wallet-connect-buttons'>
                    {isWalletConnected ? (
                        <button className="button disconnect-button" onClick={handleDisconnect}>
                            Disconnect
                        </button>
                    ) : (
                        <WalletConnect onWalletConnected={handleWalletConnected} />
                    )}
                </div>
                <h2>Hit Submit To Start Fee Calculation</h2>
                <form onSubmit={handleSubmit}>
                    <div className="buttons">
                        <button className="button submit-button" type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;
