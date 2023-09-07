import React, { useEffect, useState } from 'react';
import '../stylesheets/Loading.css';

const LoadingScreen = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMessage(true);
    }, 30000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className='container'>
      <div className='loading'>
        <h2 className='loading-text'>Loading...</h2>
        {showMessage && <div className='loading-message'>Please be patient, the blockchain is chunky</div>}
      </div>
    </div>
  );
};

export default LoadingScreen;