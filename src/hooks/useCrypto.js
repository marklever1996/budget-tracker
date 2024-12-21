import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { coinmarketcapService } from '../services/CoinmarketcapService';

export const useCrypto = () => {
    const { user } = useAuth();
    const [cryptos, setCryptos] = useState([]);
    const [totalCryptoValue, setTotalCryptoValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserCryptos = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data();
                
                if (userData?.cryptos) {
                    setCryptos(userData.cryptos);
                    await updateCryptoPrices(userData.cryptos);
                } else {
                    setCryptos([]);
                }
            } catch (error) {
                console.error('Error loading cryptos:', error);
                setError('Kon cryptodata niet laden');
            } finally {
                setIsLoading(false);
            }
        };

        loadUserCryptos();
        
        // Update prijzen elke 5 minuten
        const interval = setInterval(() => {
            if (cryptos.length > 0) {
                updateCryptoPrices(cryptos);
            }
        }, 300000);

        return () => clearInterval(interval);
    }, [user]);

    const updateCryptoPrices = async (cryptoList) => {
        if (!cryptoList.length) return;

        try {
            const symbols = cryptoList.map(crypto => crypto.symbol);
            const cryptoData = await coinmarketcapService.getMultipleCryptoPrices(symbols);
            
            const updatedCryptos = cryptoList.map(crypto => {
                const data = cryptoData.find(d => d.symbol === crypto.symbol);
                return {
                    ...crypto,
                    currentPrice: data.currentPrice,
                    change24h: data.change24h,
                    value: data.currentPrice * crypto.amount
                };
            });

            setCryptos(updatedCryptos);
            
            const newTotal = updatedCryptos.reduce((sum, crypto) => sum + crypto.value, 0);
            setTotalCryptoValue(newTotal);
        } catch (error) {
            console.error('Error updating crypto prices:', error);
            setError('Kon cryptoprijzen niet updaten');
        }
    };

    const addCrypto = async (symbol, amount) => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            const cryptoData = await coinmarketcapService.getCryptoPrice(symbol);
            
            const newCrypto = {
                symbol,
                amount: Number(amount),
                currentPrice: cryptoData.currentPrice,
                change24h: cryptoData.change24h,
                value: cryptoData.currentPrice * Number(amount),
                addedAt: new Date().toISOString()
            };

            const updatedCryptos = [...cryptos, newCrypto];

            await setDoc(doc(db, 'users', user.uid), {
                cryptos: updatedCryptos
            }, { merge: true });

            setCryptos(updatedCryptos);
            
            const total = updatedCryptos.reduce((sum, crypto) => sum + crypto.value, 0);
            setTotalCryptoValue(total);

            return newCrypto;
        } catch (error) {
            console.error('Error adding crypto:', error);
            throw new Error('Kon crypto niet toevoegen: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const removeCrypto = async (symbol) => {
        if (!user) return;

        try {
            const updatedCryptos = cryptos.filter(crypto => crypto.symbol !== symbol);
            
            await setDoc(doc(db, 'users', user.uid), {
                cryptos: updatedCryptos
            }, { merge: true });

            setCryptos(updatedCryptos);
            
            const total = updatedCryptos.reduce((sum, crypto) => sum + crypto.value, 0);
            setTotalCryptoValue(total);
        } catch (error) {
            console.error('Error removing crypto:', error);
            throw new Error('Kon crypto niet verwijderen');
        }
    };

    return {
        cryptos,
        totalCryptoValue,
        isLoading,
        error,
        addCrypto,
        removeCrypto,
        updateCryptoPrices
    };
}; 