import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/BudgetCalculator.css';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../context/BudgetContext';

const BudgetCalculator = () => {
    const navigate = useNavigate();
    const { updateBudgets, updateTotalBudget } = useBudget();
    
    // Haal inkomen op uit localStorage
    const [monthlyIncome, setMonthlyIncome] = useState(() => {
        return Number(localStorage.getItem('monthlyIncome')) || 0;
    });

    // Haal categorie budgetten op uit localStorage
    const [categoryBudgets, setCategoryBudgets] = useState(() => {
        const savedCategories = localStorage.getItem('categoryBudgets');
        return savedCategories ? JSON.parse(savedCategories) : {};
    });

    // Categorie definities met percentages
    const categories = [
        { name: 'Huisvesting', minPercent: 25, maxPercent: 35 },
        { name: 'Boodschappen', minPercent: 10, maxPercent: 15 },
        { name: 'Transport', minPercent: 10, maxPercent: 15 },
        { name: 'Utilities', minPercent: 5, maxPercent: 10 },
        { name: 'Entertainment', minPercent: 5, maxPercent: 10 },
        { name: 'Sparen', minPercent: 20, maxPercent: 20 },
        { name: 'Overig', minPercent: 5, maxPercent: 10 }
    ];

    // Bereken aanbevolen bedrag voor een categorie
    const getRecommendedAmount = (minPercent, maxPercent) => {
        if (!monthlyIncome) return "0";
        const minAmount = (monthlyIncome * minPercent) / 100;
        const maxAmount = (monthlyIncome * maxPercent) / 100;
        return minPercent === maxPercent 
            ? `€${Math.round(minAmount)}`
            : `€${Math.round(minAmount)} - €${Math.round(maxAmount)}`;
    };

    // Bereken totaal budget
    const totalBudget = Object.values(categoryBudgets).reduce((sum, amount) => sum + (Number(amount) || 0), 0);
    
    // Update totaal budget in context wanneer het verandert
    useEffect(() => {
        updateTotalBudget(totalBudget);
    }, [totalBudget, updateTotalBudget]);

    // Bereken percentage van inkomen
    const budgetPercentage = monthlyIncome ? Math.round((totalBudget / monthlyIncome) * 100) : 0;

    // Update een categorie budget
    const handleCategoryChange = (categoryName, value) => {
        setCategoryBudgets(prev => ({
            ...prev,
            [categoryName]: value
        }));
    };

    const handleSave = () => {
        // Sla alles op
        updateBudgets(categoryBudgets);
        updateTotalBudget(totalBudget);
        localStorage.setItem('monthlyIncome', monthlyIncome.toString());
        localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
        
        navigate('/dashboard');
    };

    return (
        <div className="budget-calculator">
            <div className="calculator-container">
                <div className="calculator-header">
                    <h2>Budget Instellen</h2>
                    <p>Stel je maandelijkse budgetten in per categorie</p>
                </div>

                <div className="monthly-income-section">
                    <h3>Maandelijks Inkomen</h3>
                    <div className="budget-input">
                        <span>€</span>
                        <input 
                            type="number" 
                            placeholder="Vul je inkomen in"
                            value={monthlyIncome || ''}
                            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="budget-categories">
                    {categories.map((category, index) => (
                        <div key={index} className="budget-category">
                            <h3>{category.name}</h3>
                            <div className="budget-input">
                                <span>€</span>
                                <input 
                                    type="number" 
                                    placeholder={getRecommendedAmount(category.minPercent, category.maxPercent)}
                                    value={categoryBudgets[category.name] || ''}
                                    onChange={(e) => handleCategoryChange(category.name, e.target.value)}
                                />
                            </div>
                            <p className="category-tip">
                                Aanbevolen: {category.minPercent === category.maxPercent 
                                    ? `${category.minPercent}%` 
                                    : `${category.minPercent}-${category.maxPercent}%`} 
                                van je inkomen
                            </p>
                        </div>
                    ))}
                </div>

                <div className="total-budget-section">
                    <h3>Totaal Budget</h3>
                    <span className="total-amount">€{totalBudget}</span>
                    <p className="budget-status">
                        {budgetPercentage}% van je inkomen ingedeeld
                        {budgetPercentage > 100 && 
                            <span className="warning"> (Let op: Je hebt meer dan je inkomen ingedeeld!)</span>
                        }
                    </p>
                </div>

                <div className="action-buttons">
                    <button className="cancel-button" onClick={() => navigate('/dashboard')}>
                        Annuleren
                    </button>
                    <button className="save-button" onClick={handleSave}>
                        Opslaan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BudgetCalculator; 