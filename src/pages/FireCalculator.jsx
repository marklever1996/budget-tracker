import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FireCalculator.css';
import { FireChartDashboard } from '../components/fire/FireChartDashboard';
import { monteCarloSimulation } from '../services/monteCarloService';
import { fireCalculationService } from '../services/fireCalculationService';

const FireCalculator = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        currentAge: 30,
        targetAge: 50,
        currentSavings: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        hasOwnHome: false,
        mortgageDebt: 0,
        mortgageInterestRate: 0,
        yearlyPropertyTax: 0,
        yearlyAOW: 17000,
        pensionAge: 67,
        employerPension: 0,
        investmentStrategy: 'moderate',
        expectedReturn: {
            conservative: 4.5,
            moderate: 6,
            aggressive: 7.5
        },
        inflationRate: 2,
        taxRate: 31,
        safeWithdrawalRate: 3.5
    });

    const [results, setResults] = useState({
        requiredAmount: 0,
        yearsToFIRE: 0,
        monthlyInvestmentNeeded: 0,
        yearlyPassiveIncome: 0,
        taxImpact: 0
    });

    const [simulationResults, setSimulationResults] = useState(null);

    const calculateFIRE = async () => {
        try {
            const baseCalculations = fireCalculationService.calculateRequiredAmount(inputs);
            
            const simulationData = await monteCarloSimulation({
                initialAmount: inputs.currentSavings,
                monthlyContribution: inputs.monthlyIncome - inputs.monthlyExpenses,
                yearsToRetirement: inputs.targetAge - inputs.currentAge,
                withdrawalRate: inputs.safeWithdrawalRate / 100,
                portfolioAllocation: {
                    stocks: 0.7,  // 70% aandelen
                    bonds: 0.3    // 30% obligaties
                },
                returns: {
                    stocks: 0.07,  // 7% rendement
                    bonds: 0.02    // 2% rendement
                },
                volatility: {
                    stocks: 0.15,  // 15% volatiliteit
                    bonds: 0.05    // 5% volatiliteit
                }
            });

            setResults(baseCalculations);
            setSimulationResults(simulationData);
        } catch (error) {
            console.error('Calculation error:', error);
            return {
                requiredAmount: 0,
                yearsToFIRE: 0,
                monthlyInvestmentNeeded: 0,
                yearlyPassiveIncome: 0,
                taxImpact: 0
            };
        }
    };

    useEffect(() => {
        calculateFIRE();
    }, [inputs]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    return (
        <div className="fire-calculator">
            <div className="calculator-container">
                <div className="calculator-header">
                    <h1>FIRE Calculator</h1>
                    <p>Bereken wanneer je financieel onafhankelijk kunt zijn</p>
                </div>

                <div className="calculator-section">
                    <h2><span className="section-number">1</span>Persoonlijke Gegevens</h2>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Huidige Leeftijd</label>
                            <input
                                type="number"
                                name="currentAge"
                                value={inputs.currentAge}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Gewenste FIRE Leeftijd</label>
                            <input
                                type="number"
                                name="targetAge"
                                value={inputs.targetAge}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="calculator-section">
                    <h2><span className="section-number">2</span>Financiële Situatie</h2>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Huidig Vermogen</label>
                            <input
                                type="number"
                                name="currentSavings"
                                value={inputs.currentSavings}
                                onChange={handleInputChange}
                                className="input-with-prefix"
                            />
                            <span className="input-prefix">€</span>
                        </div>
                        <div className="input-group">
                            <label>Maandelijks Inkomen</label>
                            <input
                                type="number"
                                name="monthlyIncome"
                                value={inputs.monthlyIncome}
                                onChange={handleInputChange}
                                className="input-with-prefix"
                            />
                            <span className="input-prefix">€</span>
                        </div>
                        <div className="input-group">
                            <label>Maandelijkse Uitgaven</label>
                            <input
                                type="number"
                                name="monthlyExpenses"
                                value={inputs.monthlyExpenses}
                                onChange={handleInputChange}
                                className="input-with-prefix"
                            />
                            <span className="input-prefix">€</span>
                        </div>
                    </div>
                </div>

                <div className="calculator-section">
                    <h2><span className="section-number">3</span>Aannames</h2>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Verwacht Rendement</label>
                            <input
                                type="number"
                                name="expectedReturn"
                                value={inputs.expectedReturn}
                                onChange={handleInputChange}
                                step="0.1"
                            />
                            <span className="input-description">Gemiddeld jaarlijks rendement op investeringen (%)</span>
                        </div>
                        <div className="input-group">
                            <label>Inflatie</label>
                            <input
                                type="number"
                                name="inflationRate"
                                value={inputs.inflationRate}
                                onChange={handleInputChange}
                                step="0.1"
                            />
                            <span className="input-description">Verwachte jaarlijkse inflatie (%)</span>
                        </div>
                        <div className="input-group">
                            <label>Safe Withdrawal Rate</label>
                            <input
                                type="number"
                                name="safeWithdrawalRate"
                                value={inputs.safeWithdrawalRate}
                                onChange={handleInputChange}
                                step="0.1"
                            />
                            <span className="input-description">Percentage van vermogen dat je jaarlijks kunt opnemen (%)</span>
                        </div>
                    </div>
                </div>

                <div className="results-section">
                    <div className="results-grid">
                        <div className="result-card">
                            <h3>Benodigd FIRE Vermogen</h3>
                            <span className="amount">€{results.requiredAmount.toLocaleString()}</span>
                            <p>Totaal benodigd vermogen voor financiële onafhankelijkheid</p>
                        </div>
                        <div className="result-card">
                            <h3>Jaren tot FIRE</h3>
                            <span className="amount">{results.yearsToFIRE}</span>
                            <p>Aantal jaren tot financiële onafhankelijkheid</p>
                        </div>
                        <div className="result-card">
                            <h3>Benodigde Maandelijkse Investering</h3>
                            <span className="amount">€{results.monthlyInvestmentNeeded.toLocaleString()}</span>
                            <p>Maandelijks te investeren bedrag om je doel te bereiken</p>
                        </div>
                    </div>

                    {simulationResults && (
                        <FireChartDashboard 
                            simulationData={simulationResults}
                            inputs={inputs}
                        />
                    )}
                </div>

                <div className="action-buttons">
                    <button className="secondary" onClick={() => navigate('/fire')}>
                        Terug
                    </button>
                    <button className="primary" onClick={() => navigate('/fire')}>
                        Bekijk FIRE Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FireCalculator; 