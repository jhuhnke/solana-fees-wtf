import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './stylesheets/App.css'; 
import Header from './components/Header'; 
import LoadingScreen from './components/Loading';
import Home from './components/Home'; 
import ResultScreen from './components/ResultScreen'


const App = () => {

  const [totalFees] = useState<number | null>(null);
  const [transactionCount] = useState<number | null>(null);

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/loading" component={LoadingScreen} />
        <Route path="/result">
          <ResultScreen totalFees={totalFees} transactionCount={transactionCount} /> {/* Use the ResultScreen component */}
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