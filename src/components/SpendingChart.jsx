import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import '../styles/SpendingChart.css';

// TODO:
// import { saltEdgeService } from '../services/saltEdgeService';
// import { transactionProcessor } from '../services/transactionProcessor';

const SpendingChart = () => {
    const { user } = useAuth();
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

    // Combineer de fictieve uitgaven met de echte budgetten van de user
    const categories = [
        { 
            name: 'Huisvesting', 
            current: dummyCurrentSpending['Huisvesting'],  // Fictief
            budget: categoryBudgets['Huisvesting'] || 0    // Echt budget van user
        },
        { 
            name: 'Boodschappen', 
            current: dummyCurrentSpending['Boodschappen'], // Fictief
            budget: categoryBudgets['Boodschappen'] || 0   // Echt budget van user
        },
        { 
            name: 'Transport', 
            current: dummyCurrentSpending['Transport'],    // Fictief
            budget: categoryBudgets['Transport'] || 0      // Echt budget van user
        },
        { 
            name: 'Utilities', 
            current: dummyCurrentSpending['Utilities'],    // Fictief
            budget: categoryBudgets['Utilities'] || 0      // Echt budget van user
        },
        { 
            name: 'Entertainment', 
            current: dummyCurrentSpending['Entertainment'], // Fictief
            budget: categoryBudgets['Entertainment'] || 0   // Echt budget van user
        },
        { 
            name: 'Overig', 
            current: dummyCurrentSpending['Sparen'],       // Fictief
            budget: categoryBudgets['Sparen'] || 0         // Echt budget van user
        },
        { 
            name: 'Sparen', 
            current: dummyCurrentSpending['Overig'],       // Fictief
            budget: categoryBudgets['Overig'] || 0         // Echt budget van user
        }
    ];

    // TODO:
    // const [currentSpending, setCurrentSpending] = useState({
    //     'Huisvesting': 0,
    //     'Boodschappen': 0,
    //     'Transport': 0,
    //     'Utilities': 0,
    //     'Entertainment': 0,
    //     'Sparen': 0,
    //     'Overig': 0
    // });

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

    // const fetchTransactions = async () => {
    //     try {
    //         const transactions = await saltEdgeService.getTransactions(
    //             connectionId,
    //             startDate,
    //             endDate
    //         );
            
    //         // Verwerk de transacties in categorieën
    //         const categorizedSpending = transactionProcessor.processTransactions(transactions);
            
    //         // Update de state met de echte uitgaven
    //         setCurrentSpending(categorizedSpending);
    //     } catch (error) {
    //         console.error('Error fetching transactions:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchTransactions();
    // }, []);

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