import axios from 'axios';

// Backend URL (lokaal)
const BACKEND_URL = 'http://localhost:5000/api';

class CoinmarketcapService {
    async getCryptoPrice(symbol) {
        try {
            console.log('Fetching price for:', symbol);
            
            if (!symbol) {
                throw new Error('Symbol is verplicht');
            }

            // Haal data op via de backend
            const response = await axios.get(`${BACKEND_URL}/crypto`, {
                params: {
                    ticker: symbol.toUpperCase()
                }
            });

            console.log('Backend response:', response.data);

            const data = response.data;
            if (!data) {
                throw new Error('Cryptocurrency niet gevonden');
            }

            return {
                symbol: data.symbol,
                currentPrice: data.quote.EUR.price,
                change24h: data.quote.EUR.percent_change_24h,
                marketCap: data.quote.EUR.market_cap
            };
        } catch (error) {
            console.error('Error fetching crypto price:', error.response?.data || error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Kon cryptoprijs niet ophalen'
            );
        }
    }

    async getMultipleCryptoPrices(symbols) {
        try {
            if (!symbols || !symbols.length) {
                throw new Error('Geen symbols opgegeven');
            }

            // Haal prijzen één voor één op via de backend
            const promises = symbols.map(symbol => this.getCryptoPrice(symbol));
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error fetching multiple crypto prices:', error);
            throw new Error('Kon cryptoprijzen niet ophalen');
        }
    }
}

export const coinmarketcapService = new CoinmarketcapService();  
