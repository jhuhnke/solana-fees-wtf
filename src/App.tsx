import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './stylesheets/App.css'; 
import Header from './components/Header'; 
import LoadingScreen from './components/Loading';
import Home from './components/Home'; 
import ResultScreen from './components/ResultScreen'
import { fetchEthGasPrice } from './queries/get-eth-gas'; // Import your function to fetch ethGasPrice

const App = () => {
  const [totalFees, setTotalFees] = useState<number | null>(null);
  const [transactionCount, setTransactionCount] = useState<number | null>(null);
  const [ethGasPrice, setEthGasPrice] = useState<number | null>(null);

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

    // Call your functions to fetch totalFees and transactionCount
    const fetchTotalFeesAndTransactionCount = async () => {
      // Fetch totalFees and transactionCount here
      // Call setTotalFees and setTransactionCount with fetched values
    };

    fetchEthGas();
    fetchTotalFeesAndTransactionCount();
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
          /> {/* Use the ResultScreen component */}
        </Route>
        <Route exact path="/">
          <Home /> {/* Use the Home component */}
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;