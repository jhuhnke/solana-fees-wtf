import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';


import './stylesheets/App.css'; 
import Header from './components/Header'; 
import LoadingScreen from './components/Loading';
import Home from './components/Home'; 
import ResultScreen from './components/ResultScreen'
import { fetchEthGasPrice } from './queries/get-eth-gas';

const App = () => {
  const [totalFees] = useState<number | null>(null);
  const [transactionCount] = useState<number | null>(null);
  const [ethGasPrice, setEthGasPrice] = useState<number | null>(null);
  const [walletAddress] = useState<string>('');

  useEffect(() => {
    const fetchEthGas = async () => {
      try {
        const gasPrice = await fetchEthGasPrice();
        setEthGasPrice(gasPrice);
      } catch (error) {
        console.error('Error fetching ETH gas price:', error);
      }
    };

    // Fetch total fees and transaction count here

    fetchEthGas();
  }, []);

  return (
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
  );
};

export default App;