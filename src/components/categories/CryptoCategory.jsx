import React from 'react';
import './CryptoCategory.css';

const CryptoCategory = ({ onValueChange }) => {
    return (
        <div className="crypto-content">
            <div className="crypto-distribution">
                <div className="crypto-item">
                    <span>Bitcoin</span>
                    <span>€3.500</span>
                </div>
                <div className="crypto-item">
                    <span>Ethereum</span>
                    <span>€1.500</span>
                </div>
                <button className="add-crypto-button">
                    + Crypto Toevoegen
                </button>
            </div>
        </div>
    );
};

export default CryptoCategory; 