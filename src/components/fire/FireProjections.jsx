import React from 'react';

const FireProjections = () => {
    return (
        <>
            <div className="section-header">
                <h2>FIRE Projecties</h2>
            </div>
            <div className="projections-container">
                <div className="projection-card">
                    <h3>Verwacht vermogen bij pensioen</h3>
                    <span className="projection-value">€0</span>
                    <div className="projection-details">
                        <div className="detail-item">
                            <span>Rendement</span>
                            <span>0%</span>
                        </div>
                        <div className="detail-item">
                            <span>Inflatie</span>
                            <span>0%</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FireProjections; 