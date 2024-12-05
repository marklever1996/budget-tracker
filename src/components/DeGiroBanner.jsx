import React from 'react';
import { FaLink } from 'react-icons/fa';
import './DeGiroBanner.css';

const DeGiroBanner = ({ onLinkClick }) => {
    return (
        <div className="degiro-banner">
            <div className="banner-content">
                <FaLink size={24} />
                <div className="banner-text">
                    <h3>Koppel je DeGiro account</h3>
                    <p>Krijg automatisch inzicht in je beleggingsportefeuille</p>
                </div>
                <button className="link-button" onClick={onLinkClick}>
                    Account Koppelen
                </button>
            </div>
        </div>
    );
};

export default DeGiroBanner; 