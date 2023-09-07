// WalletConnect.tsx
import React, { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface WalletConnectProps {
    onWalletConnected: (address: string) => void; // Callback function to update walletAddress
}

const WalletConnect: FC<WalletConnectProps> = ({ onWalletConnected }) => {
    const wallet = useWallet();

    useEffect(() => {
        if (wallet.connected && wallet.publicKey) {
            // Wallet is connected, update the walletAddress state in the parent component
            onWalletConnected(wallet.publicKey.toString());
        }
    }, [wallet, onWalletConnected]);

    return (
        <div>
            <WalletMultiButton />
            <WalletDisconnectButton />
        </div>
    );
};

export default WalletConnect;