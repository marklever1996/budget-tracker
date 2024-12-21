import React from 'react';
import { useAuth } from '../context/AuthContext';
import FireOverview from '../components/fire/FireOverview';
import FireProgress from '../components/fire/FireProgress';
import FireProjections from '../components/fire/FireProjections';
import '../styles/FireDashboard.css';

const FireChartDashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Laden...</div>;
    }

    return (
        <div className="fire-dashboard">
            <div className="fire-content">
                {/* FIRE Overzicht */}
                <section className="fire-section">
                    <FireOverview />
                </section>

                {/* FIRE Voortgang */}
                <section className="fire-section">
                    <FireProgress />
                </section>

                {/* FIRE Projecties */}
                <section className="fire-section">
                    <FireProjections />
                </section>
            </div>
        </div>
    );
};

export default FireChartDashboard; 