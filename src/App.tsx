import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { getTotalFeesPaid } from "./queries/get-fees";
import './stylesheets/App.css'; 
import Header from './components/Header'; 
import LoadingScreen from './components/Loading';

const ResultScreen = ({ totalFees }: { totalFees: string }) => (
  <div>
    <h2>API Result:</h2>
    <p>Total Fees: {totalFees} lamports</p>
  </div>
);

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalFees, setTotalFees] = useState<string | null>(null);

const handleGetTotalFees = async (walletAddress: string) => {
  setIsLoading(true);

  try {
    const fees = await getTotalFeesPaid(walletAddress);
    setTotalFees(fees); // Set the fees directly as a string
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (totalFees !== null) {
    return <ResultScreen totalFees={totalFees} />;
  }

  return (
    <div className="container">
      <div className="form">
        <h2>Enter A Solana Address</h2>
        <form onSubmit={(e) => { 
          e.preventDefault();
          const target = e.target as HTMLFormElement;
          const walletAddress = target.elements.namedItem("walletAddress")?.value;
          if (walletAddress) {
            handleGetTotalFees(walletAddress);
          }
        }}>
          <input type="text" name="walletAddress" />
          <div className="buttons">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/loading" component={LoadingScreen} />
        <Route path="/result" component={ResultScreen} />
        <Route
          exact
          path="/"
          component={Home}
        />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
