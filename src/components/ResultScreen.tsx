import React from 'react'; 
import { BrowserRouter as Link } from 'react-router-dom';

const ResultScreen = ({ totalFees }: { totalFees: number | null }) => (
  <div>
    <h2>API Result:</h2>
    <p>Total Fees: {totalFees} lamports</p>
    <button onClick={() => window.location.replace('/')}>Reset</button>
  </div>
);

export default ResultScreen; 