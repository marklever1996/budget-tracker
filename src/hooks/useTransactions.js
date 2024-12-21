import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { plaidService } from '../services/PlaidService';

export const useTransactions = () => {
    const { user } = useAuth();
    const [currentMonthSpending, setCurrentMonthSpending] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                // Haal access token op uit Firebase
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data();
                
                if (!userData?.plaidAccessToken) {
                    console.log('Geen bankrekening gekoppeld');
                    setCurrentMonthSpending(0);
                    return;
                }

                // Haal transacties op via Plaid
                const spending = await plaidService.getCurrentMonthTransactions(
                    userData.plaidAccessToken
                );
                
                setCurrentMonthSpending(spending);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Kon uitgaven niet ophalen');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();

        // Ververs elke 30 minuten
        const interval = setInterval(fetchTransactions, 1800000);
        return () => clearInterval(interval);
    }, [user]);

    return {
        currentMonthSpending,
        isLoading,
        error
    };
}; 