import React from 'react';
import { FaChartLine, FaRegClock, FaPiggyBank, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const FireOverview = () => {
    const navigate = useNavigate();

    const handleFIREClick = () => {
        navigate('/fire-calculator');
    };

    return (
        <>
            <div className="section-header">
                <h2>FIRE Overzicht</h2>
                <button className="edit-button" onClick={handleFIREClick}>
                    <FaEdit size={20} />
                </button>
            </div>
            <div className="fire-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaPiggyBank />
                    </div>
                    <div className="stat-content">
                        <h3>Benodigd FIRE vermogen</h3>
                        <span className="stat-value">€0</span>
                        <p className="stat-description">Gebaseerd op gewenst jaarinkomen</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaChartLine />
                    </div>
                    <div className="stat-content">
                        <h3>Huidig vermogen</h3>
                        <span className="stat-value">€0</span>
                        <p className="stat-description">Totaal van investeringen en spaargeld</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaRegClock />
                    </div>
                    <div className="stat-content">
                        <h3>Jaren tot FIRE</h3>
                        <span className="stat-value">0</span>
                        <p className="stat-description">Bij huidige spaarrate</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FireOverview; 