import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBudget } from '../../context/BudgetContext';
import './SpendingChart.css';

// TODO:
// import { saltEdgeService } from '../services/saltEdgeService';
// import { transactionProcessor } from '../services/transactionProcessor';

const SpendingChart = () => {
    const { user } = useAuth();
    // Haal de categorieën en budgetten op uit localStorage
    const savedCategories = localStorage.getItem('budgetCategories');
    const categories = savedCategories ? JSON.parse(savedCategories) : [];
    const categoryBudgets = JSON.parse(localStorage.getItem('categoryBudgets') || '{}');


    // Tijdelijke dummy data voor huidige uitgaven (later te vervangen door echte data)
    const dummyCurrentSpending = {
        'Huisvesting': 2320,    // Fictief
        'Boodschappen': 450,   // Fictief
        'Transport': 650,      // Fictief
        'Utilities': 520,      // Fictief
        'Entertainment': 320,  // Fictief
        'Sparen': 200,        // Fictief
        'Overig': 100         // Fictief
    };

    // Const CurrentSpending wordt later vervangen door echte data,
    // Deze data wordt opgehaald uit de SaltEdge API

    // Helper functie om kleur te bepalen op basis van budget gebruik
    const getBarColor = (current, budget) => {
        if (budget === 0) return '#95a5a6'; // Grijs als er geen budget is ingesteld
        
        const percentage = (current / budget) * 100;
        
        if (percentage > 100) {
            // Fel rood als over budget
            return '#e74c3c';
        } else if (percentage > 80) {
            // Gradient van oranje naar rood tussen 80-100%
            const redIntensity = Math.round(231 + ((percentage - 80) * 1.2));
            return `rgb(${redIntensity}, ${Math.round(76 + (100 - percentage))}, 60)`;
        } else {
            // Gradient van groen naar oranje tussen 0-80%
            // Bij 0% = donkergroen, bij 80% = oranje
            const greenValue = Math.round(46 + ((80 - percentage) * 2));
            const redValue = Math.round((percentage / 80) * 231);
            return `rgb(${redValue}, ${greenValue}, 60)`;
        }
    };

    return (
        <div className="barchart">
            {Object.entries(dummyCurrentSpending).map(([categoryName, current], index) => (
                <div key={index} className="category-container">
                    <div className="category-header">
                        <span className="category-name">{categoryName}</span>
                        <span className="category-amounts">
                            €{current} / €{categoryBudgets[categoryName] || 0}
                        </span>
                    </div>
                    <div className="bar-container">
                        <div 
                            className="bar"
                            style={{ 
                                width: `${(current / (categoryBudgets[categoryName] || 1)) * 100}%`,
                                backgroundColor: getBarColor(current, categoryBudgets[categoryName])
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpendingChart; 