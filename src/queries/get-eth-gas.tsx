import axios from 'axios';

const ethGasApiUrl = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=D3E37B9QGM6WHDDZ9TVPRIRES2HH5XYEDG';

export async function fetchEthGasPrice() {
  try {
    const ethGasResponse = await axios.get(ethGasApiUrl);
    //const ethGasLimitResponse = await axios.get(ethGasLimitApiUrl);

    const { ProposeGasPrice, suggestBaseFee } = ethGasResponse.data.result;
    //const { GasLimit } = ethGasLimitResponse.data.result; 
    
    // Calculate the ETH transaction fee
    const ethTransactionFee = (parseFloat(ProposeGasPrice) + parseFloat(suggestBaseFee)) * 80000;
    
    return ethTransactionFee;
  } catch (error) {
    console.error('Error fetching ETH gas price:', error);
    throw error;
  }
}