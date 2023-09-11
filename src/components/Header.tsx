import React from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import '../stylesheets/Header.css'

const Header = () => {
    return (
        <header className="header">
            <div className='logo'>
                <img src={process.env.PUBLIC_URL + '/pepe.jpg'} alt="pepe"></img>
            </div>
            <h1 className="title">F(R)EE</h1>
            <div className='social-icons'>
                <a href="https://twitter.com/web3-analyst">
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
                <a href="https://github.com/jhuhnke">
                <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
            </div>
        </header>
    ); 
}; 

export default Header; 