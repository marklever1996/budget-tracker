import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { plaidService } from '../services/PlaidService';

const PlaidCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const publicToken = searchParams.get('public_token');
                if (publicToken) {
                    await plaidService.exchangePublicToken(publicToken);
                    // Navigeer terug naar de savings pagina
                    navigate('/investments');
                }
            } catch (error) {
                console.error('Error in Plaid callback:', error);
                navigate('/investments', { 
                    state: { error: 'Er ging iets mis bij het verbinden met je bank' } 
                });
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="loading-container">
            <p>Bezig met verbinden...</p>
        </div>
    );
};

export default PlaidCallback; 