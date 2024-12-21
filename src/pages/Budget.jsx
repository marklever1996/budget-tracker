import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Local Storage; voor het ophalen van de maandelijkse inkomen
// Context; voor het ophalen van de budgetten en het totaal budget
// Bij opschaling, gebruik Backend & Database setup
import { useBudget } from '../context/BudgetContext';

import SpendingChart from '../components/budget/SpendingChart';
import SavingsGoals from '../components/budget/SavingsGoal';
import MonthlySpending from '../components/budget/MonthlySpending';
import TotalBudgetChart from '../components/budget/TotalBudgetChart';

import '../styles/Budget.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Local Storage; voor het ophalen van de maandelijkse inkomen
    // Context; voor het ophalen van de budgetten en het totaal budget
    // Bij opschaling, gebruik Backend & Database setup
    const { budgets, totalBudget } = useBudget();
    const monthlyIncome = Number(localStorage.getItem('monthlyIncome'));
    
    // Debug logging toevoegen
    console.log('Dashboard rendering, user:', user);

    // Basis controle toevoegen
    if (!user) {
        return <div>Laden...</div>;
    }

    const handleBudgetClick = () => {
        navigate('/budget-calculator');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* Budget overzicht */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Budget overzicht</h2>
                        <button className="edit-button" onClick={handleBudgetClick}>
                            <FaEdit size={20} />
                        </button>
                    </div>
                    <div className="barchart-container">
                        <div className="chart-item">
                            <TotalBudgetChart />
                        </div>
                        <div className="chart-item">
                            <SpendingChart />
                        </div>
                        <div className="chart-item">
                            <SavingsGoals />
                        </div>
                    </div>
                </section>

                {/* Maandelijkse uitgaven */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Maandelijkse uitgaven</h2>
                    </div>
                    <div className="monthly-spending-chart">
                        <MonthlySpending />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
