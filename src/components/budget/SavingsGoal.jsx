import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './SavingsGoal.css';

const SavingsGoal = () => {
    const { user } = useAuth();
    const [showDetails, setShowDetails] = useState(false);

    // Bereken resterende tijd (voorbeeld berekening)
    const remainingYears = 3;
    const remainingMonths = 8;

    return (
        <div className="savings-section">
            <h3>Spaardoelen</h3>
            <div className="savings-container">
                <div className="savings-goal">
                    <div className="goal-header">
                        <span className="goal-name">{user?.spaardoelItem || 'Nieuwe Auto'}</span>
                        <span className="goal-amounts">
                            €{user?.spaardoelBedrag || '5000'} / €{user?.spaardoelBedragTotaal || '15000'}
                        </span>
                    </div>
                    <div className="goal-container"
                         onMouseEnter={() => setShowDetails(true)}
                         onMouseLeave={() => setShowDetails(false)}>
                        <div className="goal-progress-bar">
                            <div 
                                className="goal-progress"
                                style={{ 
                                    width: `${(user?.spaardoelBedrag / user?.spaardoelBedragTotaal) * 100}%`
                                }}
                            />
                        </div>
                        <div className="goal-info">
                            <span className="goal-text">
                                {Math.round((user?.spaardoelBedrag / user?.spaardoelBedragTotaal) * 100)}% van doel
                            </span>
                            {showDetails && (
                                <div className="goal-details">
                                    <p>Nog {remainingYears} jaar en {remainingMonths} maanden te gaan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavingsGoal; 