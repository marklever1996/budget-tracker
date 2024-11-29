import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/SavingsGoal.css';

const SavingsGoal = () => {
    const { user } = useAuth();

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
                    <div className="goal-progress-bar">
                        <div 
                            className="goal-progress"
                            style={{ 
                                width: `${(user?.spaardoelBedrag / user?.spaardoelBedragTotaal) * 100}%`
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavingsGoal; 