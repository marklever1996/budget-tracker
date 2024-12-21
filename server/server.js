require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Plaid client configuratie
const plaidConfig = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SANDBOX_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(plaidConfig);

// Plaid endpoints
app.post('/api/plaid/create-link-token', async (req, res) => {
    try {
        const request = {
            user: { client_user_id: 'test_user' },
            client_name: 'Budget Tracker',
            products: ['auth', 'transactions'],
            country_codes: ['NL'],
            language: 'nl'
        };

        console.log('Creating link token...');
        const response = await plaidClient.linkTokenCreate(request);
        console.log('Got link token:', response.data);

        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error('Plaid error:', error.response?.data || error);
        res.status(500).json({ error: error.message });
    }
});

// Token uitwisseling endpoint
app.post('/api/plaid/exchange-token', async (req, res) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: req.body.public_token
        });
        
        res.json({ 
            access_token: response.data.access_token,
            item_id: response.data.item_id
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rekeningen ophalen endpoint
app.post('/api/plaid/accounts', async (req, res) => {
    try {
        const response = await plaidClient.accountsGet({
            access_token: req.body.access_token
        });
        res.json({ accounts: response.data.accounts });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Transacties ophalen endpoint
app.post('/api/plaid/transactions', async (req, res) => {
    try {
        const { access_token, start_date, end_date } = req.body;

        const request = {
            access_token,
            start_date,
            end_date,
            options: {
                include_personal_finance_category: true,
                count: 500,
                offset: 0
            }
        };

        console.log('Fetching transactions...', { start_date, end_date });
        const response = await plaidClient.transactionsGet(request);
        
        // Filter uitgaven en maak ze positief
        const transactions = response.data.transactions
            .filter(transaction => transaction.amount < 0)  // Filter uitgaven (negatieve bedragen)
            .map(transaction => ({
                ...transaction,
                amount: Math.abs(transaction.amount),  // Maak bedrag positief
                personal_finance_category: {
                    primary: transaction.personal_finance_category?.primary || 'OTHER'
                }
            }));

        // Log voor debugging
        console.log('Processed transactions:', transactions.map(t => ({
            amount: t.amount,
            category: t.personal_finance_category.primary,
            name: t.name
        })));

        // Bereken totaal (bedragen zijn nu al positief)
        const totalSpending = transactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        console.log('Total spending:', totalSpending);

        res.json({ 
            transactions,
            total_spending: totalSpending
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data
        });
    }
});

// Voeg deze endpoint toe aan de bestaande server code
app.post('/api/plaid/disconnect', async (req, res) => {
    try {
        console.log('Handling disconnect request...');
        // In sandbox mode hoeven we geen echte Plaid call te maken
        res.json({ success: true });
    } catch (error) {
        console.error('Error disconnecting:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Er ging iets mis!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
});
