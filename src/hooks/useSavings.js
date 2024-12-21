import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { plaidService } from '../services/PlaidService';
import { usePlaidLink } from 'react-plaid-link';

export const useSavings = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [totalSavingsValue, setTotalSavingsValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [linkToken, setLinkToken] = useState(null);

    // Maak getToken een useCallback functie
    const getToken = useCallback(async () => {
        if (linkToken) return; // Voorkom dubbele token aanvragen
        
        try {
            console.log('Requesting new link token...');
            const token = await plaidService.createLinkToken();
            setLinkToken(token);
        } catch (err) {
            console.error('Error getting link token:', err);
            setError(err.message);
        }
    }, [linkToken]);

    // Laad link token alleen als we er nog geen hebben
    useEffect(() => {
        if (!linkToken) {
            getToken();
        }
    }, [getToken]);

    // Laad opgeslagen rekeningen bij het mounten
    useEffect(() => {
        const loadSavedAccounts = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data();
                
                if (userData?.plaidAccessToken) {
                    const accountsData = await plaidService.getAccounts(userData.plaidAccessToken);
                    
                    const filteredAccounts = accountsData.filter(account => 
                        account.type === 'depository' && 
                        (account.subtype === 'savings' || account.subtype === 'checking')
                    );
                    
                    setAccounts(filteredAccounts);
                    
                    const total = filteredAccounts.reduce(
                        (sum, account) => sum + account.balances.current, 
                        0
                    );
                    setTotalSavingsValue(total);
                }
            } catch (err) {
                console.error('Error loading saved accounts:', err);
                setError('Kon opgeslagen rekeningen niet laden');
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedAccounts();
    }, [user]);

    // Ontkoppel functie
    const disconnectBank = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            console.log('Starting bank disconnection...');
            
            // Verwijder Plaid access token uit Firebase
            await setDoc(doc(db, 'users', user.uid), {
                plaidAccessToken: null
            }, { merge: true });

            // Reset lokale state
            setAccounts([]);
            setTotalSavingsValue(0);
            setLinkToken(null); // Reset ook de link token

            // Roep de Plaid disconnect endpoint aan
            await plaidService.disconnectBank();
            
            console.log('Bank successfully disconnected');
        } catch (err) {
            console.error('Error disconnecting bank:', err);
            throw new Error('Kon bank niet ontkoppelen');
        } finally {
            setIsLoading(false);
        }
    };

    // Plaid Link configuratie
    const config = {
        token: linkToken,
        onSuccess: async (public_token) => {
            try {
                setIsLoading(true);
                console.log('Plaid link success, exchanging token...');
                
                const { access_token } = await plaidService.exchangePublicToken(public_token);
                
                // Sla access token op in Firebase
                await setDoc(doc(db, 'users', user.uid), {
                    plaidAccessToken: access_token
                }, { merge: true });
                
                console.log('Access token saved, fetching accounts...');
                
                // Update accounts
                const accountsData = await plaidService.getAccounts(access_token);
                const filteredAccounts = accountsData.filter(account => 
                    account.type === 'depository' && 
                    (account.subtype === 'savings' || account.subtype === 'checking')
                );
                
                setAccounts(filteredAccounts);
                const total = filteredAccounts.reduce(
                    (sum, account) => sum + account.balances.current, 
                    0
                );
                setTotalSavingsValue(total);
                
                console.log('Accounts successfully loaded');
            } catch (err) {
                console.error('Error in Plaid link success:', err);
                setError('Kon rekeningen niet ophalen: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        },
        onExit: (err) => {
            if (err) {
                console.error('Plaid link exit with error:', err);
                setError('Er ging iets mis bij het verbinden met je bank');
            }
        }
    };

    const { open, ready } = usePlaidLink(config);

    return {
        accounts,
        totalSavingsValue,
        isLoading,
        error,
        ready,
        open,
        disconnectBank
    };
}; 