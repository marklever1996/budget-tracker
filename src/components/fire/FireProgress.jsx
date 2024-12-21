import React from 'react';

const FireProgress = () => {
    const progress = 0; // Default waarde

    return (
        <>
            <div className="section-header">
                <h2>FIRE Voortgang</h2>
            </div>
            <div className="progress-container">
                <div className="progress-stats">
                    <div className="progress-info">
                        <h3>Voortgang naar FIRE doel</h3>
                        <span className="progress-percentage">{progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <div className="progress-details">
                    <div className="detail-item">
                        <span className="detail-label">Benodigd maandelijks</span>
                        <span className="detail-value">€0</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Huidige spaarrate</span>
                        <span className="detail-value">0%</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FireProgress; 