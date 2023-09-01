import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './stylesheets/App.css'; 
import Header from './components/Header'; 
import LoadingScreen from './components/Loading';
import Home from './components/Home'; 
import ResultScreen from './components/ResultScreen'


const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/loading" component={LoadingScreen} />
        <Route path="/result">
          <ResultScreen /> {/* Use the ResultScreen component */}
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