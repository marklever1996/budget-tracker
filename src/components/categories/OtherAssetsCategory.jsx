import React from 'react';
import './CategoryCard.css';

const OtherAssetsCategory = ({ onValueChange }) => {
    return (
        <div className="other-assets-content">
            <div className="other-assets-distribution">
                <div className="empty-assets">
                    <p>Geen overige bezittingen toegevoegd</p>
                    <button className="add-asset-button">
                        + Bezitting Toevoegen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtherAssetsCategory; 