import React from 'react'; 
import '../stylesheets/Header.css'

const Header = () => {
    return (
        <header className="header">
            <div className='logo'>
                <img src={process.env.PUBLIC_URL + '/pepe.jpg'} alt="pepe"></img>
            </div>
            <h1 className="title">Fees NBD</h1>
        </header>
    ); 
}; 

export default Header; 