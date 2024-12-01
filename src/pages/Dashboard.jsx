import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit } from 'react-icons/fa';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

import SpendingChart from '../components/SpendingChart';
import SavingsGoals from '../components/SavingsGoal';
import FireChartDashboard from '../components/FireChartDashboard';
import MonthlySpending from '../components/MonthlySpending';
import TotalBudgetChart from '../components/TotalBudgetChart';
// Local Storage; voor het ophalen van de maandelijkse inkomen
// Context; voor het ophalen van de budgetten en het totaal budget
// Bij opschaling, gebruik Backend & Database setup
import { useBudget } from '../context/BudgetContext';

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

    const handleFIREClick = () => {
        navigate('/fire-calculator');
    };

    const handleBudgetClick = () => {
        navigate('/budget-calculator');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* Budget overzicht */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>
                            Budget overzicht
                            {/* Als de user hierop klikt, wordt deze geleid naar de BudgetCalculator.jsx pagina*/}
                            <button className="edit-button" onClick={handleBudgetClick}>
                                <FaEdit size={20} />
                            </button>
                        </h2>
                    </div>
                    <div className="barchart-container">
                        <TotalBudgetChart />
                        <SpendingChart />
                        <SavingsGoals />
                    </div>
                </section>

                {/* Fire overzicht */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>
                            Fire overzicht
                            <button className="edit-button" onClick={handleFIREClick}>
                                <FaEdit size={20} />
                            </button>
                        </h2>
                    </div>
                    <div className="fire-container">
                        <FireChartDashboard />
                    </div>
                </section>

                {/* Recent uitgaven */}
                <section className="dashboard-section">
                    <h2>Maandelijkse uitgaven</h2>
                    <div className="monthly-spending-chart">
                        <MonthlySpending />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Dashboard;
