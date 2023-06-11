import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { getFees } from "./queries/all-fees";
import './stylesheets/App.css'; 
import Header from './components/Header'; 
import LoadingScreen from './components/Loading';

const ResultScreen = ({ result }: { result: string }) => (
  <div>
    <h2>API Result:</h2>
    <p>{result}</p>
  </div>
);

const Home = ({ onSubmit }: { onSubmit: (input: string) => void }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await getFees(input); 
      setResult(JSON.stringify(response, null, 2)); 
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); 
    }
     
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (result) {
    return <ResultScreen result={result} />;
  }

  return (
    <div className="container">
      <div className="form">
        <h2>Enter A Solana Address</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
          <div className="buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setInput('')}>Reset</button>
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
          render={() => <Home onSubmit={(input) => console.log('Input:', input)} />}
        />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;