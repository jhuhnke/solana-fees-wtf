import React from 'react'; 
import '../stylesheets/Loading.css'

const LoadingScreen = () => {
    return (
        <div className = 'container'>
            <div className='loading'>
                <h2 className='loadingtext'>Loading...</h2>
            </div>
        </div>
    );
}; 

export default LoadingScreen;