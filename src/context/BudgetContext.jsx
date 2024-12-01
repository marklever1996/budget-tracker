import React, { createContext, useContext, useState } from 'react';

const BudgetContext = createContext(null);

export const BudgetProvider = ({ children }) => {
    const [budgets, setBudgets] = useState(() => {
        const savedBudgets = localStorage.getItem('budgets');
        return savedBudgets ? JSON.parse(savedBudgets) : [
            { name: 'Huisvesting', current: 0, budget: 0 },
            { name: 'Boodschappen', current: 0, budget: 0 },
            { name: 'Transport', current: 0, budget: 0 },
            { name: 'Utilities', current: 0, budget: 0 },
            { name: 'Entertainment', current: 0, budget: 0 },
            { name: 'Sparen', current: 0, budget: 0 },
            { name: 'Overig', current: 0, budget: 0 }
        ];
    });

    const [totalBudget, setTotalBudget] = useState(() => {
        return Number(localStorage.getItem('totalBudget')) || 0;
    });

    const updateBudgets = (newBudgets) => {
        setBudgets(newBudgets);
        localStorage.setItem('budgets', JSON.stringify(newBudgets));
    };

    const updateTotalBudget = (newTotal) => {
        setTotalBudget(newTotal);
        localStorage.setItem('totalBudget', newTotal.toString());
    };

    const contextValue = {
        budgets: budgets || [],
        updateBudgets: updateBudgets || (() => {}),
        totalBudget: totalBudget || 0,
        updateTotalBudget: updateTotalBudget || (() => {})
    };

    return (
        <BudgetContext.Provider value={contextValue}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (context === null) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
}; 