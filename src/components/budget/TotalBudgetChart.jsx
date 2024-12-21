import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';
import { useTransactions } from '../../hooks/useTransactions';
import './TotalBudgetChart.css';

const TotalBudgetChart = () => {
    const { user } = useAuth();
    const { totalBudget } = useBudget();
    const { currentMonthSpending, isLoading, error } = useTransactions();

    const percentage = (currentMonthSpending / totalBudget) * 100;

    return (
        <div className="total-budget-chart">
            <div className="budget-header">
                <span className="budget-title">Totaal Budget</span>
                <span className="budget-amounts">
                    {isLoading ? (
                        'Laden...'
                    ) : (
                        `€${currentMonthSpending.toLocaleString()} / €${totalBudget.toLocaleString()}`
                    )}
                </span>
            </div>
            <div className="budget-bar-container">
                <div 
                    className="budget-progress"
                    style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(to right, 
                            #2ecc71 0%, 
                            #2ecc71 30%, 
                            #f1c40f 50%, 
                            #e67e22 70%, 
                            #e74c3c 100%
                        )`
                    }}
                />
            </div>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
};

export default TotalBudgetChart; 