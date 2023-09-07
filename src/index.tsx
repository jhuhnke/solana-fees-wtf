import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WalletProvider } from '@solana/wallet-adapter-react'; // Import WalletProvider
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'; 
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';

const root = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <WalletProvider wallets={[new PhantomWalletAdapter(), new BackpackWalletAdapter()]}>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </React.StrictMode>,
  root
);

reportWebVitals();
