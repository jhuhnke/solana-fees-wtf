import React, { FC, useState } from 'react';
import { getTotalFeesPaid } from '../queries/get-fees';
import LoadingScreen from './Loading';
import ResultScreen from './ResultScreen';
import WalletConnect from './WalletConnect';

const Home: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [totalFees, setTotalFees] = useState<number | null>(null);
    const [transactionCount, setTransactionCount] = useState<number | null>(null);
    const [ethGasPrice, setEthGasPrice] = useState<number | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null); // Use null instead of an empty string

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

    // Callback function to update walletAddress when the wallet is connected
    const handleWalletConnected = (address: string) => {
        setWalletAddress(address);
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
                <WalletConnect onWalletConnected={handleWalletConnected} />
                <h2>OR</h2>
                <h2>Enter A Solana Address</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="walletAddress" placeholder="Enter a wallet address" />
                    <div className="buttons">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;
