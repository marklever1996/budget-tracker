import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { stockService } from '../services/stockService';

export const useInvestments = () => {
    const { user } = useAuth();
    const [stocks, setStocks] = useState([]);
    const [totalInvestmentsValue, setTotalInvestmentsValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Laad aandelen van de gebruiker
    useEffect(() => {
        const loadUserStocks = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                console.log('Loading user stocks...');
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data();
                
                console.log('User data:', userData);
                
                if (userData?.stocks) {
                    console.log('Setting stocks:', userData.stocks);
                    setStocks(userData.stocks);
                    await updateStockPrices(userData.stocks);
                } else {
                    console.log('No stocks found for user');
                    setStocks([]);
                }
            } catch (error) {
                console.error('Error loading stocks:', error);
                setError('Kon aandelendata niet laden');
            } finally {
                setIsLoading(false);
            }
        };

        loadUserStocks();
        
        // Update prijzen elke 5 minuten
        const interval = setInterval(() => {
            if (stocks.length > 0) {
                updateStockPrices(stocks);
            }
        }, 300000);

        return () => clearInterval(interval);
    }, [user]);

    // Update aandelenprijzen en totale waarde
    const updateStockPrices = async (stocksList) => {
        if (!stocksList.length) return;

        try {
            const tickers = stocksList.map(stock => stock.ticker);
            const stockData = await stockService.getMultipleStockPrices(tickers);
            
            const updatedStocks = stocksList.map(stock => {
                const data = stockData.find(d => d.ticker === stock.ticker);
                return {
                    ...stock,
                    currentPrice: data.currentPrice,
                    change: data.change,
                    value: data.currentPrice * stock.shares
                };
            });

            setStocks(updatedStocks);
            
            // Bereken nieuwe totale waarde
            const newTotal = updatedStocks.reduce((sum, stock) => sum + stock.value, 0);
            
            // Update alleen als de waarde daadwerkelijk veranderd is
            if (newTotal !== totalInvestmentsValue) {
                setTotalInvestmentsValue(newTotal);
            }
        } catch (error) {
            console.error('Error updating stock prices:', error);
            setError('Kon aandelenprijzen niet updaten');
        }
    };

    // Voeg nieuw aandeel toe
    const addStock = async (ticker, shares) => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            // Valideer ticker en haal initiële data op
            const stockData = await stockService.getStockPrice(ticker);
            
            const newStock = {
                ticker,
                shares: Number(shares),
                currentPrice: stockData.currentPrice,
                change: stockData.change,
                value: stockData.currentPrice * Number(shares),
                addedAt: new Date().toISOString()
            };

            // Haal eerst de huidige stocks op uit Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();
            const currentStocks = userData?.stocks || [];
            
            const updatedStocks = [...currentStocks, newStock];

            // Update Firestore
            await setDoc(doc(db, 'users', user.uid), {
                stocks: updatedStocks
            }, { merge: true });

            // Update lokale state
            setStocks(updatedStocks);
            
            // Update totale waarde
            const total = updatedStocks.reduce((sum, stock) => sum + stock.value, 0);
            setTotalInvestmentsValue(total);

            return newStock;
        } catch (error) {
            console.error('Error adding stock:', error);
            throw new Error('Kon aandeel niet toevoegen: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Verwijder aandeel
    const removeStock = async (ticker) => {
        if (!user) return;

        try {
            const updatedStocks = stocks.filter(stock => stock.ticker !== ticker);
            
            // Update Firestore
            await setDoc(doc(db, 'users', user.uid), {
                stocks: updatedStocks
            }, { merge: true });

            setStocks(updatedStocks);
            
            // Bereken en update totale waarde
            const total = updatedStocks.reduce((sum, stock) => sum + stock.value, 0);
            setTotalInvestmentsValue(total);
        } catch (error) {
            console.error('Error removing stock:', error);
            throw new Error('Kon aandeel niet verwijderen');
        }
    };

    return {
        stocks,
        totalInvestmentsValue,
        isLoading,
        error,
        addStock,
        removeStock,
        updateStockPrices
    };
};

