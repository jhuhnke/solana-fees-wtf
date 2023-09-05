import React, { useState, useEffect } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react'; 
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'; 
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './stylesheets/App.css'; 
import Header from './components/Header'; 
import LoadingScreen from './components/Loading';
import Home from './components/Home'; 
import ResultScreen from './components/ResultScreen'
import { fetchEthGasPrice } from './queries/get-eth-gas'; // Import your function to fetch ethGasPrice

const App = () => {
  const [totalFees] = useState<number | null>(null);
  const [transactionCount] = useState<number | null>(null);
  const [ethGasPrice, setEthGasPrice] = useState<number | null>(null);
  const [walletAddress] = useState<string>('');

  // wallet adapters
  const phantomWallet = new PhantomWalletAdapter(); 
  const backpackWallet = new BackpackWalletAdapter(); 

  useEffect(() => {
    // Fetch ethGasPrice here and set it using setEthGasPrice
    const fetchEthGas = async () => {
      try {
        const gasPrice = await fetchEthGasPrice();
        setEthGasPrice(gasPrice);
      } catch (error) {
        console.error('Error fetching ETH gas price:', error);
      }
    };

  
    const fetchTotalFeesAndTransactionCount = async () => {
     
    };

    fetchEthGas();
    fetchTotalFeesAndTransactionCount();
  }, []);

  return (
    <WalletProvider wallets={[phantomWallet, backpackWallet]}>
      <Router>
        <Header />
        <Switch>
          <Route path="/loading" component={LoadingScreen} />
          <Route path="/result">
            <ResultScreen 
              totalFees={totalFees} 
              transactionCount={transactionCount}
              ethGasPrice={ethGasPrice} 
              walletAddress={walletAddress}
            /> 
          </Route>
          <Route exact path="/">
            <Home /> 
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </WalletProvider>
  );
};

export default App;