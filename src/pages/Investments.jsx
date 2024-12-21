import React, { useState, useEffect, useCallback } from 'react';
import { FaChartLine, FaPiggyBank, FaHome, FaCar, FaCoins, FaEllipsisH } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Hooks
import { useVehicles } from '../hooks/useVehicles';
import { useInvestments } from '../hooks/useInvestments';
import { useRealEstate } from '../hooks/useRealEstate';
import { useSavings } from '../hooks/useSavings';

// Components
import CategoryCard from '../components/categories/CategoryCard';
import InvestmentsCategory from '../components/categories/InvestmentsCategory';
import SavingsCategory from '../components/categories/SavingsCategory';
import RealEstateCategory from '../components/categories/RealEstateCategory';
import VehiclesCategory from '../components/categories/VehiclesCategory';
import CryptoCategory from '../components/categories/CryptoCategory';
import OtherAssetsCategory from '../components/categories/OtherAssetsCategory';
import NotificationBanner from '../components/NotificationBanner';

import '../styles/Investments.css';

const Investments = () => {
    const { user } = useAuth();
    // Hooks
    const { totalVehicleValue } = useVehicles();
    const { totalInvestmentsValue } = useInvestments();
    const { totalRealEstateValue } = useRealEstate();
    const { totalSavingsValue } = useSavings();
    
    // Totaal vermogen. Dit is de som van alle categorieën. setTotalPortfolioValue wordt verkregen uit de useEffect.
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);

    // Portfolio data. Dit is de percentage verandering van de totale waarde. (winst/verlies)
    const [portfolioData, setPortfolioData] = useState({
        monthlyChange: 0,
        yearlyChange: 0
    });

    // Verplaats categories naar state
    const [categories, setCategories] = useState({
        investments: {
            name: 'Beleggingen',
            icon: <FaChartLine />,
            value: totalInvestmentsValue,
            change: 0,
        },
        savings: {
            name: 'Spaargeld',
            icon: <FaPiggyBank />,
            value: totalSavingsValue,
            change: 0.2
        },
        realEstate: {
            name: 'Woning',
            icon: <FaHome />,
            value: totalRealEstateValue, // WOZ
            change: -0.5
        },
        vehicles: {
            name: 'Voertuigen',
            icon: <FaCar />,
            value: totalVehicleValue,
            change: 0.5
        },
        crypto: {
            name: 'Crypto',
            icon: <FaCoins />,
            value: 0,
            change: 0.5
        },
        other: {
            name: 'Overige bezittingen',
            icon: <FaEllipsisH />,
            value: 0,
            change: 0
        }
    });

    // Update wanneer totalVehicleValue verandert
    useEffect(() => {
        setCategories(prev => ({
            ...prev,
            vehicles: {
                ...prev.vehicles,
                value: totalVehicleValue
            }
        }));
    }, [totalVehicleValue]);

    // Update wanneer totalInvestmentsValue verandert
    useEffect(() => {
        // Voorkom onnodige updates als de waarde 0 is
        if (totalInvestmentsValue !== undefined) {
            setCategories(prev => {
                // Alleen updaten als de waarde daadwerkelijk anders is
                if (prev.investments.value === totalInvestmentsValue) {
                    return prev;
                }
                return {
                    ...prev,
                    investments: {
                        ...prev.investments,
                        value: totalInvestmentsValue
                    }
                };
            });
        }
    }, [totalInvestmentsValue]);

    // Update totale waarde wanneer een categorie verandert
    const updateTotalValue = useCallback((categoryName, newValue) => {
        setCategories(prev => {
            // Voorkom onnodige updates
            if (prev[categoryName].value === newValue) {
                return prev;
            }
            return {
                ...prev,
                [categoryName]: {
                    ...prev[categoryName],
                    value: newValue
                }
            };
        });
    }, []); // Lege dependency array omdat de functie niet afhankelijk is van props of state

    // Update initiële totale waarde wanneer categories veranderen
    useEffect(() => {
        const initialTotal = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
        setTotalPortfolioValue(initialTotal);
    }, [categories]);
    
    return (
        <div className="investments-container">
            <NotificationBanner />

            <div className="investments-header">
                <div className="total-value">
                    <h1>Totaal Vermogen</h1>
                    <div className="value-amount">
                        €{totalPortfolioValue.toLocaleString()}
                    </div>
                    <div className="value-changes">
                        <span className={`change monthly ${portfolioData.monthlyChange >= 0 ? 'positive' : 'negative'}`}>
                            {portfolioData.monthlyChange}% deze maand
                        </span>
                        <span className={`change yearly ${portfolioData.yearlyChange >= 0 ? 'positive' : 'negative'}`}>
                            {portfolioData.yearlyChange}% dit jaar
                        </span>
                    </div>
                </div>
            </div>

            <div className="portfolio-grid">
                {Object.entries(categories).map(([key, category]) => (
                    <CategoryCard key={key} category={category}>
                        {key === 'investments' && (
                            <InvestmentsCategory 
                                onValueChange={(value) => updateTotalValue('investments', value)}
                            />
                        )}
                        {key === 'savings' && (
                            <SavingsCategory 
                                onValueChange={(value) => updateTotalValue('savings', value)}
                            />
                        )}
                        {key === 'realEstate' && (
                            <RealEstateCategory 
                                onValueChange={(value) => updateTotalValue('realEstate', value)}
                            />
                        )}
                        {key === 'vehicles' && (
                            <VehiclesCategory 
                                onValueChange={(value) => updateTotalValue('vehicles', value)}
                            />
                        )}
                        {key === 'crypto' && (
                            <CryptoCategory 
                                onValueChange={(value) => updateTotalValue('crypto', value)}
                            />
                        )}
                        {/* Voeg andere categorieën toe op dezelfde manier */}
                    </CategoryCard>
                ))}
            </div>
        </div>
    );
};

export default Investments; 