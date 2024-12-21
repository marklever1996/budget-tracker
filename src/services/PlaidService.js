import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api';

class PlaidService {
    async createLinkToken() {
        try {
            // Wacht even tot Plaid geladen is
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Requesting link token from backend...');
            const response = await axios.post(`${BACKEND_URL}/plaid/create-link-token`);
            console.log('Link token response:', response.data);
            
            if (!response.data.link_token) {
                throw new Error('Geen link token ontvangen van de server');
            }
            
            return response.data.link_token;
        } catch (error) {
            console.error('Error creating link token:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(`Kon geen verbinding maken met Plaid: ${error.response?.data?.error || error.message}`);
        }
    }

    async exchangePublicToken(publicToken) {
        try {
            const response = await axios.post(`${BACKEND_URL}/plaid/exchange-token`, {
                public_token: publicToken
            });
            return response.data;
        } catch (error) {
            console.error('Error exchanging public token:', error);
            throw error;
        }
    }

    async getAccounts(accessToken) {
        try {
            const response = await axios.post(`${BACKEND_URL}/plaid/accounts`, {
                access_token: accessToken
            });
            return response.data.accounts;
        } catch (error) {
            console.error('Error fetching accounts:', error);
            throw error;
        }
    }

    async disconnectBank() {
        try {
            console.log('Calling disconnect endpoint...');
            const response = await axios.post(`${BACKEND_URL}/plaid/disconnect`);
            console.log('Disconnect response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error disconnecting bank:', error);
            throw new Error('Kon bank niet ontkoppelen: ' + 
                (error.response?.data?.error || error.message));
        }
    }

    async refreshBalances(accessToken) {
        try {
            const response = await axios.post(`${BACKEND_URL}/plaid/refresh-balances`, {
                access_token: accessToken
            });
            return response.data.accounts;
        } catch (error) {
            console.error('Error refreshing balances:', error);
            throw error;
        }
    }

    async getCurrentMonthTransactions(accessToken) {
        try {
            // Bereken start en einddatum voor huidige maand
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                .toISOString().split('T')[0];
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                .toISOString().split('T')[0];

            console.log('Fetching transactions for period:', { startDate, endDate });

            const response = await axios.post(`${BACKEND_URL}/plaid/transactions`, {
                access_token: accessToken,
                start_date: startDate,
                end_date: endDate
            });

            // De server stuurt nu het totaalbedrag direct terug
            return response.data.total_spending;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw new Error('Kon transacties niet ophalen: ' + 
                (error.response?.data?.error || error.message));
        }
    }
}

export const plaidService = new PlaidService();
