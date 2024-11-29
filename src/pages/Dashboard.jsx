import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';
import SpendingChart from '../components/SpendingChart';
import SavingsGoals from '../components/SavingsGoal';
import FireChartDashboard from '../components/FireChartDashboard';
import MonthlySpending from '../components/MonthlySpending';

const Dashboard = () => {
    const { user } = useAuth();
    
    // Debug logging toevoegen
    console.log('Dashboard rendering, user:', user);

    // Basis controle toevoegen
    if (!user) {
        return <div>Laden...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* Budget overzicht */}
                <section className="dashboard-section">
                    <h2>Budget overzicht</h2>
                    <div className="barchart-container">
                        <SpendingChart />
                        <SavingsGoals />
                    </div>
                </section>

                {/* Fire overzicht */}
                <section className="dashboard-section">
                    <h2>Fire overzicht</h2>
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
