// HTTP client voor JavaScript
import axios from 'axios';

// Environment variables; zie .env voor de API key. Deze API key wordt hier ingeladen
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const API_BASE_URL = 'https://www.alphavantage.co/query';

// Deze service is nog niet volledig, maar de basis is er
// Het is nog niet duidelijk hoe de waarde van de aandelen moet worden opgehaald
// Deze waarde wordt niet opgeslagen in de database, maar moet handmatig worden ingevoerd

class StockService {
    // Deze functie haalt de prijs van een bepaald aandeel op
    async getStockPrice(ticker) {
        try {
            console.log('Fetching stock price for:', ticker);
            const response = await axios.get(API_BASE_URL, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: ticker,
                    apikey: ALPHA_VANTAGE_API_KEY
                }
            });

            console.log('API Response:', response.data);

            const quote = response.data['Global Quote'];
            if (!quote || Object.keys(quote).length === 0) {
                console.error('Invalid response format:', response.data);
                throw new Error('Geen data gevonden voor dit aandeel');
            }

            // Controleer of alle benodigde velden aanwezig zijn
            if (!quote['05. price'] || !quote['08. previous close']) {
                console.error('Missing required fields in quote:', quote);
                throw new Error('Onvolledige data voor dit aandeel');
            }

            const price = Number(quote['05. price']);
            const previousClose = Number(quote['08. previous close']);
            
            // Valideer de waarden
            if (isNaN(price) || isNaN(previousClose)) {
                throw new Error('Ongeldige prijsgegevens ontvangen');
            }

            const change = previousClose !== 0 
                ? ((price - previousClose) / previousClose) * 100 
                : 0;

            const result = {
                ticker,
                currentPrice: price,
                change: Number(change.toFixed(2)),
                currency: 'USD'
            };

            console.log('Processed stock data:', result);
            return result;

        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 429) {
                throw new Error('API limiet bereikt. Probeer het later opnieuw.');
            }
            
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Kon aandelenprijs niet ophalen'
            );
        }
    }

    // Deze functie haalt de prijzen van meerdere aandelen op
    async getMultipleStockPrices(tickers) {
        try {
            const promises = tickers.map(ticker => this.getStockPrice(ticker));
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error fetching multiple stock prices:', error);
            throw new Error('Kon aandelenprijzen niet ophalen');
        }
    }
}

// Deze service wordt gebruikt in de useInvestments hook
export const stockService = new StockService(); 