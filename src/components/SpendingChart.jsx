import React from 'react';
import '../styles/SpendingChart.css';

const SpendingChart = () => {
    // Dummy data (later te vervangen door echte data uit context)
    const categories = [
        {
            name: 'Huisvesting',
            current: 800,
            budget: 1000,
        },
        {
            name: 'Boodschappen',
            current: 350,
            budget: 400,
        },
        {
            name: 'Transport',
            current: 150,
            budget: 200,
        },
        {
            name: 'Entertainment',
            current: 120,
            budget: 150,
        }
    ];

    return (
        <div className="barchart">
            {categories.map((category, index) => (
                <div key={index} className="category-container">
                    <div className="category-header">
                        <span className="category-name">{category.name}</span>
                        <span className="category-amounts">
                            €{category.current} / €{category.budget}
                        </span>
                    </div>
                    <div className="bar-container">
                        <div 
                            className="bar"
                            style={{ 
                                width: `${(category.current / category.budget) * 100}%`,
                                backgroundColor: category.current > category.budget ? '#e74c3c' : '#3498db'
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpendingChart; 