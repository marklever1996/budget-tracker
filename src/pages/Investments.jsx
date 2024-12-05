import React, { useState, useEffect } from 'react';
import { FaChartLine, FaPiggyBank, FaHome, FaCar, FaCoins, FaEllipsisH } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { wozService } from '../services/wozService';
import { useVehicles } from '../hooks/useVehicles';

import CategoryCard from '../components/categories/CategoryCard';
import InvestmentsCategory from '../components/categories/InvestmentsCategory';
import SavingsCategory from '../components/categories/SavingsCategory';
import RealEstateCategory from '../components/categories/RealEstateCategory';
import VehiclesCategory from '../components/categories/VehiclesCategory';
import CryptoCategory from '../components/categories/CryptoCategory';
import OtherAssetsCategory from '../components/categories/OtherAssetsCategory';
import DeGiroBanner from '../components/DeGiroBanner';

import '../styles/Investments.css';


const Investments = () => {
    const { user } = useAuth();
    const [isDeGiroLinked, setIsDeGiroLinked] = useState(false);
    const [wozValue, setWozValue] = useState(0);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
    const [portfolioData, setPortfolioData] = useState({
        monthlyChange: 0,
        yearlyChange: 0
    });
    const { totalVehicleValue } = useVehicles();

    // Haal WOZ waarde op bij laden
    useEffect(() => {
        const fetchWozValue = async () => {
            try {
                const userAddress = {
                    postcode: '1234AB',  // TODO: Uit user profiel halen
                    huisnummer: '1'
                };
                const wozData = await wozService.getWozValue(userAddress);
                setWozValue(wozData.value);
            } catch (error) {
                console.error('Error fetching WOZ value:', error);
            }
        };

        if (user) {
            fetchWozValue();
        }
    }, [user]);

    // Categorieën configuratie
    const categories = {
        investments: {
            name: 'Beleggingen',
            icon: <FaChartLine />,
            value: 0,
            change: 0,
            needsDeGiro: true
        },
        savings: {
            name: 'Spaargeld',
            icon: <FaPiggyBank />,
            value: 35000,
            change: 0.2
        },
        realEstate: {
            name: 'Woning',
            icon: <FaHome />,
            value: wozValue,
            change: 0.5
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
            value: 5000,
            change: 0.5
        },
        other: {
            name: 'Overige bezittingen',
            icon: <FaEllipsisH />,
            value: 0,
            change: 0
        }
    };

    // Update totale portfolio waarde wanneer categorieën veranderen
    const updateTotalValue = (categoryName, newValue) => {
        categories[categoryName].value = newValue;
        const total = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
        setTotalPortfolioValue(total);
    };

    const handleLinkDeGiro = () => {
        // TODO: Implementeer DeGiro koppeling
        setIsDeGiroLinked(true);
    };

    return (
        <div className="investments-container">
            {/* Banner */}
            {/* {!isDeGiroLinked && (
                <DeGiroBanner onLinkClick={handleLinkDeGiro} />
            )} */}

            {/* Portfolio Header */}
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

            {/* Portfolio Grid */}
            <div className="portfolio-grid">
                <CategoryCard category={categories.investments}>
                    <InvestmentsCategory 
                        isDeGiroLinked={isDeGiroLinked} 
                        onLinkDeGiro={handleLinkDeGiro}
                        onValueChange={(value) => updateTotalValue('investments', value)}
                    />
                </CategoryCard>

                <CategoryCard category={categories.savings}>
                    <SavingsCategory 
                        onValueChange={(value) => updateTotalValue('savings', value)}
                    />
                </CategoryCard>

                <CategoryCard category={categories.realEstate}>
                    <RealEstateCategory 
                        wozValue={wozValue}
                        onValueChange={(value) => updateTotalValue('realEstate', value)}
                    />
                </CategoryCard>

                <CategoryCard category={categories.vehicles}>
                    <VehiclesCategory 
                        onValueChange={(value) => {
                            updateTotalValue('vehicles', value);
                        }}
                    />
                </CategoryCard>

                <CategoryCard category={categories.crypto}>
                    <CryptoCategory 
                        onValueChange={(value) => updateTotalValue('crypto', value)}
                    />
                </CategoryCard>

                <CategoryCard category={categories.other}>
                    <OtherAssetsCategory 
                        onValueChange={(value) => updateTotalValue('other', value)}
                    />
                </CategoryCard>
            </div>
        </div>
    );
};

export default Investments; 