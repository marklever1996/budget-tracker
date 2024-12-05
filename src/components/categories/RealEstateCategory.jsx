import React from 'react';
import './RealEstateCategory.css';

const RealEstateCategory = ({ wozValue, onValueChange }) => {
    return (
        <div className="real-estate-content">
            <div className="real-estate-distribution">
                <div className="real-estate-item">
                    <span>WOZ Waarde</span>
                    <span>€{wozValue?.toLocaleString() || '0'}</span>
                </div>
                <div className="real-estate-info">
                    <p>Laatste taxatie: 1 januari 2024</p>
                    <button className="update-button">
                        WOZ Waarde Bijwerken
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RealEstateCategory; 