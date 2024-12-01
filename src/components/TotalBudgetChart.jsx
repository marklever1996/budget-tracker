import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import '../styles/TotalBudgetChart.css';

const TotalBudgetChart = () => {
    const { user } = useAuth();
    const { totalBudget } = useBudget();
    const currentSpending = 1800;
    const percentage = (currentSpending / totalBudget) * 100;

    return (
        <div className="total-budget-chart">
            <div className="budget-header">
                <span className="budget-title">Totaal Budget</span>
                <span className="budget-amounts">€{currentSpending} / €{totalBudget}</span>
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
        </div>
    );
};

export default TotalBudgetChart; 