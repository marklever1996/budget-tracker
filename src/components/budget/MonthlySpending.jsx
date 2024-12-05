import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './MonthlySpending.css';

const MonthlySpending = () => {
    const { user } = useAuth();
    const [hoveredMonth, setHoveredMonth] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [maxSpending, setMaxSpending] = useState(0);

    // Helper functie om maandnamen te genereren
    const getMonthName = (monthsAgo) => {
        const date = new Date();
        date.setMonth(date.getMonth() - monthsAgo);
        return date.toLocaleString('nl-NL', { month: 'short' });
    };

    // Helper functie om kleur te bepalen op basis van uitgaven
    const getBarColor = (amount) => {
        // percentage berekenen op basis van maxSpending
        const percentage = (amount / maxSpending) * 100;
        if (percentage > 80) return '#e74c3c'; // Rood voor hoge uitgaven
        if (percentage > 60) return '#e67e22'; // Oranje voor medium-hoge uitgaven
        if (percentage > 40) return '#f1c40f'; // Geel voor medium uitgaven
        return '#2ecc71'; // Groen voor lage uitgaven
    };

    // Simuleer data ophaling
    useEffect(() => {
        // Dit wordt later vervangen door een echte API call
        const fetchMonthlySpending = () => {
            const dummyData = [
                { month: getMonthName(11), total: 3200, details: [
                    { category: 'Huisvesting', amount: 1500 },
                    { category: 'Boodschappen', amount: 800 },
                    { category: 'Transport', amount: 500 },
                    { category: 'Entertainment', amount: 400 }
                ]},
                { month: getMonthName(10), total: 1800, details: [
                    { category: 'Huisvesting', amount: 1500 },
                    { category: 'Boodschappen', amount: 200 },
                    { category: 'Transport', amount: 50 },
                    { category: 'Entertainment', amount: 50 }
                ]},
                { month: getMonthName(9), total: 2900, details: [
                    { category: 'Huisvesting', amount: 1500 },
                    { category: 'Boodschappen', amount: 600 },
                    { category: 'Transport', amount: 400 },
                    { category: 'Entertainment', amount: 400 }
                ]},
                { month: getMonthName(8), total: 2100, details: [/* ... */] },
                { month: getMonthName(7), total: 2800, details: [/* ... */] },
                { month: getMonthName(6), total: 1900, details: [/* ... */] },
                { month: getMonthName(5), total: 2400, details: [/* ... */] },
                { month: getMonthName(4), total: 1700, details: [/* ... */] },
                { month: getMonthName(3), total: 3100, details: [/* ... */] },
                { month: getMonthName(2), total: 2000, details: [/* ... */] },
                { month: getMonthName(1), total: 2200, details: [/* ... */] },
                { month: getMonthName(0), total: 2500, details: [/* ... */] }
            ];
            setMonthlyData(dummyData);
        };

        fetchMonthlySpending();
    }, []);

    // 
    useEffect(() => {
        if (monthlyData.length > 0) {
            setMaxSpending(Math.max(...monthlyData.map(data => data.total)));
        }
    }, [monthlyData]);

    // Helper functie om bedrag naar hoogte te converteren
    const getHeight = (amount) => {
        return (amount / maxSpending) * 300; // 300px maximale hoogte
    };

    return (
        <div className="monthly-spending">
            <div className="chart-container">
                {/* Y-as labels */}
                <div className="y-axis">
                    <div className="y-label">€0</div>
                    <div className="y-label">€{Math.round(maxSpending * 0.25)}</div>
                    <div className="y-label">€{Math.round(maxSpending * 0.5)}</div>
                    <div className="y-label">€{Math.round(maxSpending * 0.75)}</div>
                    <div className="y-label">€{Math.round(maxSpending)}</div>
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
                                style={{ 
                                    height: `${getHeight(data.total)}px`,
                                    backgroundColor: getBarColor(data.total)
                                }}
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