import React, { useState, useEffect } from 'react';
import { FaLink, FaWallet, FaTimes, FaUniversity } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { plaidService } from '../services/PlaidService';
import '../styles/NotificationBanner.css';

const NotificationBanner = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentNotification, setCurrentNotification] = useState(null);
    
    const handleBankConnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const linkToken = await plaidService.createLinkToken();
            // Open Plaid Link
            window.location.href = `/investments?link_token=${linkToken}`;
            markActionAsComplete('bank');
        } catch (error) {
            setError(error.message || 'Kon geen verbinding maken met de bank');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBrokerConnect = async (brokerCode) => {
        setIsLoading(true);
        setError(null);
        try {
            const connection = await saltEdgeService.createConnection(user.uid, brokerCode);
            if (!connection?.connect_url) {
                throw new Error('Geen connectie URL ontvangen');
            }
            window.location.href = connection.connect_url;
        } catch (error) {
            setError(error.message || 'Kon geen verbinding maken met broker');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTrezorConnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Implementeer Trezor connectie logica
            markActionAsComplete('trezor');
        } catch (error) {
            setError(error.message || 'Kon geen verbinding maken met Trezor');
        } finally {
            setIsLoading(false);
        }
    };

    const notifications = [
        {
            id: 'bank',
            title: 'Verbind je bank',
            description: 'Koppel je bankrekening om je saldo automatisch bij te werken',
            icon: <FaUniversity size={24} />,
            buttons: [{
                label: 'Verbind nu',
                action: handleBankConnect
            }]
        },
        {
            id: 'broker',
            title: 'Koppel je broker account',
            description: 'Krijg automatisch inzicht in je beleggingsportefeuille',
            icon: <FaLink size={24} />,
            completed: false,
            buttons: [
                { label: 'Koppel ING Beleggen', action: () => handleBrokerConnect('ing_investments_nl') },
                { label: 'Koppel Rabobank Beleggen', action: () => handleBrokerConnect('rabobank_investments_nl') },
                { label: 'Koppel ABN AMRO Beleggen', action: () => handleBrokerConnect('abnamro_investments_nl') }
            ]
        },
        {
            id: 'trezor',
            title: 'Koppel je Trezor',
            description: 'Voeg je cryptocurrency portfolio toe aan je overzicht',
            icon: <FaWallet size={24} />,
            completed: false,
            buttons: [
                { label: 'Koppel Trezor', action: handleTrezorConnect }
            ]
        }
    ];

    useEffect(() => {
        // Haal alleen voltooide acties op uit localStorage
        const completedActions = JSON.parse(localStorage.getItem('completedActions') || '[]');
        
        // Vind de eerste niet-voltooide notificatie
        const nextNotification = notifications.find(notif => 
            !completedActions.includes(notif.id)
        );
        
        setCurrentNotification(nextNotification);
    }, []);

    const markActionAsComplete = (notificationId) => {
        const completedActions = JSON.parse(localStorage.getItem('completedActions') || '[]');
        const updatedCompleted = [...completedActions, notificationId];
        localStorage.setItem('completedActions', JSON.stringify(updatedCompleted));
        
        // Update de huidige notificatie
        const nextNotification = notifications.find(notif => 
            !updatedCompleted.includes(notif.id)
        );
        setCurrentNotification(nextNotification);
    };

    if (!currentNotification) return null;

    return (
        <div className="notification-banner">
            {/* Dismiss button; functionaliteit wordt toegevoegd later */}
            <button className="dismiss-button">
                <FaTimes size={16} />
            </button>
            <div className="banner-content">
                {currentNotification.icon}
                <div className="banner-text">
                    <h3>{currentNotification.title}</h3>
                    <p>{currentNotification.description}</p>
                </div>
                <div className="banner-buttons">
                    {currentNotification.buttons.map((button, index) => (
                        <button 
                            key={index}
                            className="link-button" 
                            onClick={button.action}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Bezig met verbinden...' : button.label}
                        </button>
                    ))}
                </div>
            </div>
            {error && (
                <div className="banner-error">
                    {error}
                </div>
            )}
        </div>
    );
};

export default NotificationBanner; 