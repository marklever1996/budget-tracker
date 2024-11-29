import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/FireChartDashboard.css';

const FireChartDashboard = () => {
    const { user } = useAuth();
    const [fireData, setFireData] = useState({
        currentAge: 30,
        targetAge: 45,
        currentSavings: 50000,
        monthlyInvestment: 2000,
        expectedReturn: 7,
        safeWithdrawalRate: 4,
        targetAmount: 0,
        currentProgress: 0,
        yearlySpending: 0
    });

    // Bereken FIRE doelen
    useEffect(() => {
        const calculateFIRE = () => {
            const yearsToFIRE = fireData.targetAge - fireData.currentAge;
            const monthsToFIRE = yearsToFIRE * 12;
            
            // Bereken totaal vermogen op pensioenleeftijd
            let futureValue = fireData.currentSavings;
            const monthlyRate = fireData.expectedReturn / 100 / 12;

            for (let i = 0; i < monthsToFIRE; i++) {
                futureValue = futureValue * (1 + monthlyRate) + fireData.monthlyInvestment;
            }

            // Bereken veilig jaarlijks te besteden bedrag
            const yearlySpending = (futureValue * (fireData.safeWithdrawalRate / 100));
            
            // Bereken huidige voortgang
            const targetAmount = yearlySpending * (100 / fireData.safeWithdrawalRate);
            const currentProgress = (fireData.currentSavings / targetAmount) * 100;

            setFireData(prev => ({
                ...prev,
                targetAmount: Math.round(targetAmount),
                currentProgress: Math.round(currentProgress * 10) / 10,
                yearlySpending: Math.round(yearlySpending)
            }));
        };

        calculateFIRE();
    }, [fireData.currentAge, fireData.targetAge, fireData.currentSavings, 
        fireData.monthlyInvestment, fireData.expectedReturn, fireData.safeWithdrawalRate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFireData(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    return (
        <div className="fire-calculator">
            <div className="fire-inputs">
                <div className="input-group">
                    <label>Huidige leeftijd</label>
                    <input
                        type="number"
                        name="currentAge"
                        value={fireData.currentAge}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <label>Gewenste pensioenleeftijd</label>
                    <input
                        type="number"
                        name="targetAge"
                        value={fireData.targetAge}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <label>Huidig spaargeld</label>
                    <input
                        type="number"
                        name="currentSavings"
                        value={fireData.currentSavings}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <label>Maandelijkse investering</label>
                    <input
                        type="number"
                        name="monthlyInvestment"
                        value={fireData.monthlyInvestment}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="fire-results">
                <div className="monthly-investment">
                    <h3>Maandelijks bedrag om te investeren</h3>
                    <span className="amount">€{fireData.monthlyInvestment}</span>
                </div>

                <div className="fire-progress">
                    <h3>FIRE progressie</h3>
                    <div className="progress-bar">
                        <div 
                            className="progress" 
                            style={{ width: `${fireData.currentProgress}%` }}
                        />
                    </div>
                    <span className="progress-text">{fireData.currentProgress}% van 100%</span>
                </div>

                <div className="total-savings">
                    <h3>Totaal spaargeld op pensioenleeftijd</h3>
                    <span className="amount">€{fireData.targetAmount.toLocaleString()}</span>
                </div>

                <div className="yearly-spending">
                    <h3>Veilig jaarlijks te besteden bedrag</h3>
                    <span className="amount">€{fireData.yearlySpending.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default FireChartDashboard; 