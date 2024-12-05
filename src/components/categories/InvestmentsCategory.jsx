import React from 'react';
import { FaLink } from 'react-icons/fa';
import './InvestmentsCategory.css';

const InvestmentsCategory = ({ isDeGiroLinked, onLinkDeGiro, onValueChange }) => {
    if (!isDeGiroLinked) {
        return (
            <div className="investments-content">
                <div className="link-degiro">
                    <p>Koppel je DeGiro account om je beleggingen te zien</p>
                    <button onClick={onLinkDeGiro}>
                        <FaLink /> Account Koppelen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="investments-content">
            <div className="investments-distribution">
                <div className="investment-item">
                    <span>Aandelen</span>
                    <span>€0</span>
                </div>
                <div className="investment-item">
                    <span>ETF's</span>
                    <span>€0</span>
                </div>
                <div className="investment-item">
                    <span>Obligaties</span>
                    <span>€0</span>
                </div>
            </div>
        </div>
    );
};

export default InvestmentsCategory;
