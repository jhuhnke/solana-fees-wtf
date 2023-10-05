import React from 'react'; 

interface MintSuccessProps {
    mintAddress: string;
}

const MintSuccess: React.FC<MintSuccessProps> = ({ mintAddress }) => {
  return (
    <div className='container'>
      <h1>NFT Minted Successfully!</h1>
      <p>Your NFT is minted to token account: {mintAddress}</p>
      <a href={`https://solscan.io/token/${mintAddress}`} target="_blank" rel="noopener noreferrer">View on Solscan</a>
      <div>
        <button onClick={() => window.location.href = '/'}>Home</button>
        <button onClick={() => window.location.href = '/results'}>Results</button>
      </div>
    </div>
  );
};

export default MintSuccess;