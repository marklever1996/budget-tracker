import React from 'react';
import './SavingsCategory.css';

const SavingsCategory = ({ onValueChange }) => {
    return (
        <div className="savings-content">
            <div className="savings-distribution">
                <div className="savings-item">
                    <span>Spaarrekening</span>
                    <span>€25.000</span>
                </div>
                <div className="savings-item">
                    <span>Deposito</span>
                    <span>€10.000</span>
                </div>
            </div>
        </div>
    );
};

export default SavingsCategory; 