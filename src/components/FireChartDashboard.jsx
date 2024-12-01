import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import '../styles/FireChartDashboard.css';

const FireChartDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);

    const handleEditClick = () => {
        navigate('/fire-calculator');
    };

    // Bereken resterende tijd (voorbeeld berekening)
    const remainingYears = 15;
    const remainingMonths = 4;

    return (
        <div className="fire-dashboard">
            <div className="fire-stats-vertical">
                <div className="stat-item">
                    <h3>Maandelijks te investeren</h3>
                    <span className="amount">€2.000</span>
                </div>

                <div className="stat-item">
                    <h3>Totaal op pensioenleeftijd</h3>
                    <span className="amount">€1.250.000</span>
                </div>

                <div className="stat-item">
                    <h3>Jaarlijks te besteden bij FIRE doel</h3>
                    <span className="amount">€50.000</span>
                </div>

                <div className="stat-item">
                    <h3>FIRE Progressie</h3>
                    <div className="progress-container"
                         onMouseEnter={() => setShowDetails(true)}
                         onMouseLeave={() => setShowDetails(false)}>
                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{ width: `30%` }}
                            />
                        </div>
                        <div className="progress-info">
                            <span className="progress-text">30% van doel</span>
                            {showDetails && (
                                <div className="progress-details">
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

export default FireChartDashboard; 