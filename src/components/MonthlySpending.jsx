import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/MonthlySpending.css';

const MonthlySpending = () => {
    const { user } = useAuth();
    const [hoveredMonth, setHoveredMonth] = useState(null);

    // Helper functie om maandnamen te genereren
    const getMonthName = (monthsAgo) => {
        const date = new Date();
        date.setMonth(date.getMonth() - monthsAgo);
        return date.toLocaleString('nl-NL', { month: 'short' });
    };

    // Dummy data voor de laatste 12 maanden
    const monthlyData = [
        { month: getMonthName(11), total: 2100, details: [
            { category: 'Huisvesting', amount: 1000 },
            { category: 'Boodschappen', amount: 400 },
            { category: 'Transport', amount: 300 },
            { category: 'Entertainment', amount: 400 }
        ]},
        { month: getMonthName(10), total: 2300, details: [
            { category: 'Huisvesting', amount: 1000 },
            { category: 'Boodschappen', amount: 500 },
            { category: 'Transport', amount: 400 },
            { category: 'Entertainment', amount: 400 }
        ]},
        // ... voeg meer maanden toe
    ];

    // Vind de hoogste uitgave voor de schaling van de Y-as
    const maxSpending = Math.max(...monthlyData.map(data => data.total));

    // Helper functie om bedrag naar hoogte te converteren
    const getHeight = (amount) => {
        return (amount / maxSpending) * 300; // 300px maximale hoogte
    };

    return (
        <div className="monthly-spending">
            <div className="chart-container">
                {/* Y-as labels */}
                <div className="y-axis">
                    {[0, maxSpending/2, maxSpending].map((value, index) => (
                        <div key={index} className="y-label">
                            €{Math.round(value)}
                        </div>
                    ))}
                </div>

                {/* Bars */}
                <div className="bars-container">
                    {monthlyData.map((data, index) => (
                        <div 
                            key={index}
                            className="bar-wrapper"
                            onMouseEnter={() => setHoveredMonth(index)}
                            onMouseLeave={() => setHoveredMonth(null)}
                        >
                            <div 
                                className="bar"
                                style={{ height: `${getHeight(data.total)}px` }}
                            />
                            <div className="x-label">{data.month}</div>

                            {/* Hover details */}
                            {hoveredMonth === index && (
                                <div className="hover-details">
                                    <h4>€{data.total}</h4>
                                    {data.details.map((detail, i) => (
                                        <div key={i} className="detail-item">
                                            <span>{detail.category}:</span>
                                            <span>€{detail.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MonthlySpending; 