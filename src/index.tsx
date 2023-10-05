import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WalletProvider } from '@solana/wallet-adapter-react'; // Import WalletProvider
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'; 
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { Buffer } from 'buffer';
import process from 'process';
window.process = process;
global.Buffer = Buffer;


ReactDOM.render(
  <React.StrictMode>
    <WalletProvider wallets={[new PhantomWalletAdapter(), new BackpackWalletAdapter()]}>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
