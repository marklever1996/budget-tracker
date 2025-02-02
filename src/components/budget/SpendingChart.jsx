import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { plaidService } from '../../services/PlaidService';
import { FaExclamationCircle } from 'react-icons/fa';
import SmartAdvisor from './SmartAdvisor';
import './SpendingChart.css';

const SpendingChart = () => {
    const { user } = useAuth();
    const [categorySpending, setCategorySpending] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Haal de categorieën en budgetten op uit localStorage
    const savedCategories = localStorage.getItem('budgetCategories');
    // Zorg ervoor dat we alleen de categorienamen gebruiken
    const categories = savedCategories ? JSON.parse(savedCategories).map(cat => 
        typeof cat === 'string' ? cat : cat.name
    ) : [];
    const categoryBudgets = JSON.parse(localStorage.getItem('categoryBudgets') || '{}');

    // Helper functie om kleur te bepalen op basis van budget gebruik
    const getBarColor = (current, budget) => {
        if (budget === 0) return '#95a5a6'; // Grijs als er geen budget is ingesteld
        
        const percentage = (current / budget) * 100;
        
        if (percentage > 100) {
            return '#e74c3c';
        } else if (percentage > 80) {
            const redIntensity = Math.round(231 + ((percentage - 80) * 1.2));
            return `rgb(${redIntensity}, ${Math.round(76 + (100 - percentage))}, 60)`;
        } else {
            const greenValue = Math.round(46 + ((80 - percentage) * 2));
            const redValue = Math.round((percentage / 80) * 231);
            return `rgb(${redValue}, ${greenValue}, 60)`;
        }
    };

    // Plaid naar onze categorieën mapping
    const plaidCategoryMapping = {
        'RENT_AND_UTILITIES': 'Huisvesting',
        'FOOD_AND_DRINK': 'Boodschappen',
        'TRANSPORTATION': 'Transport',
        'ENTERTAINMENT': 'Entertainment',
        'TRANSFER': 'Sparen',
        'GENERAL_MERCHANDISE': 'Overig',
        'PERSONAL_CARE': 'Overig',
        'TRAVEL': 'Entertainment',
        'LOAN_PAYMENTS': 'Huisvesting',
        'GENERAL_SERVICES': 'Utilities',
        'INCOME': 'Overig',
        'OTHER': 'Overig'
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data();

                if (!userData?.plaidAccessToken) {
                    console.log('Geen bankrekening gekoppeld');
                    return;
                }

                const { transactions: fetchedTransactions } = await plaidService.getCurrentMonthTransactions(
                    userData.plaidAccessToken
                );

                // Sla de transacties op in state
                setTransactions(fetchedTransactions);

                // Log ruwe transacties voor debugging
                console.log('Raw transactions:', fetchedTransactions.map(t => ({
                    amount: t.amount,
                    category: t.personal_finance_category?.primary,
                    name: t.name
                })));

                // Groepeer transacties per categorie
                const spendingByCategory = fetchedTransactions.reduce((acc, transaction) => {
                    const plaidCategory = transaction.personal_finance_category?.primary || 'OTHER';
                    const mappedCategory = plaidCategoryMapping[plaidCategory] || 'Overig';
                    
                    acc[mappedCategory] = (acc[mappedCategory] || 0) + transaction.amount;
                    return acc;
                }, {});

                console.log('Final spending breakdown:', spendingByCategory);
                setCategorySpending(spendingByCategory);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Kon uitgaven niet ophalen');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [user]);

    if (isLoading) return <div>Laden...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="barchart">
            {categories.map((categoryName, index) => {
                const current = categorySpending[categoryName] || 0;
                const budget = categoryBudgets[categoryName] || 0;
                const isOverBudget = current > budget && budget > 0;

                return (
                    <div key={index} className="category-container">
                        <div className="category-header">
                            <div className="category-info">
                                <span className="category-name">{categoryName}</span>
                                {isOverBudget && (
                                    <button 
                                        className={`warning-icon ${selectedCategory === categoryName ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(
                                            selectedCategory === categoryName ? null : categoryName
                                        )}
                                        title="Klik voor besparingsadvies"
                                    >
                                        <FaExclamationCircle />
                                    </button>
                                )}
                            </div>
                            <span className="category-amounts">
                                €{current.toLocaleString()} / €{budget}
                            </span>
                        </div>
                        <div className="bar-container">
                            <div 
                                className="bar"
                                style={{ 
                                    width: `${(current / (budget || 1)) * 100}%`,
                                    backgroundColor: getBarColor(current, budget)
                                }}
                            />
                        </div>
                        
                        {isOverBudget && selectedCategory === categoryName && (
                            <div className="advisor-wrapper">
                                <SmartAdvisor
                                    transactions={transactions.filter(t => 
                                        plaidCategoryMapping[t.personal_finance_category?.primary] === categoryName
                                    )}
                                    category={categoryName}
                                    budget={budget}
                                    currentSpending={current}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SpendingChart; 