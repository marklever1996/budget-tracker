import React, { useState, useEffect } from 'react';
import { FaRobot, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './SmartAdvisor.css';

const SmartAdvisor = ({ transactions, category, budget, currentSpending }) => {
    const [advice, setAdvice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAdvice = async () => {
            if (currentSpending <= budget) return;

            setIsLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/api/get-budget-advice', {
                    category,
                    budget,
                    current_spending: currentSpending,
                    transactions: transactions.map(t => ({
                        merchant_name: t.merchant_name || 'Onbekend',
                        amount: t.amount,
                        category: t.personal_finance_category?.primary || 'OTHER',
                        date: t.date
                    }))
                });

                setAdvice(response.data);
            } catch (error) {
                console.error('Error getting advice:', error);
                setError(
                    error.response?.data?.detail || 
                    'Kon geen verbinding maken met de AI-adviseur. Probeer het later opnieuw.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        getAdvice();
    }, [transactions, category, budget, currentSpending]);

    if (!advice || currentSpending <= budget) return null;

    return (
        <div className="smart-advisor">
            {isLoading ? (
                <div className="advisor-loading">
                    <FaSpinner className="spinner" />
                    <span>AI-advies wordt gegenereerd...</span>
                </div>
            ) : error ? (
                <div className="advisor-error">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Probeer opnieuw</button>
                </div>
            ) : (
                <>
                    <div className="advisor-header">
                        <FaRobot className="advisor-icon" />
                        <h3>Persoonlijk Besparingsadvies</h3>
                    </div>
                    
                    <div className="advisor-content">
                        <div className="savings-potential">
                            <span>Geschatte mogelijke besparing:</span>
                            <strong>€{advice.potential_savings}</strong>
                        </div>
                        
                        <div className="top-spending">
                            <h4>Top Uitgaven:</h4>
                            <ul>
                                {advice.top_spending.map(([merchant, amount], index) => (
                                    <li key={index}>
                                        <span>{merchant}</span>
                                        <span>€{amount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="ai-advice">
                            <h4>AI Advies:</h4>
                            <p>{advice.advice}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SmartAdvisor; 