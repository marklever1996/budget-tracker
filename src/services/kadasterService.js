import axios from 'axios';

// API configuratie uit environment variables
const KADASTER_API_KEY = import.meta.env.VITE_WOZ_API_KEY;
const API_BASE_URL = 'https://api.kadaster.nl/woz/v1';

/**
 * Service voor het ophalen van WOZ-waarden via de Kadaster API
 * Deze service wordt gebruikt voor het waarderen van onroerend goed in de portefeuille
 */
class KadasterService {
    /**
     * Haalt de WOZ-waarde op voor een specifiek adres
     * @param {string} address - Het volledige adres (postcode + huisnummer)
     * @returns {Object} - Object met WOZ-waarde, peildatum en gebruiksdoel
     */
    async getWOZValue(address) {
        try {
            // Log voor debugging doeleinden
            console.log('WOZ-waarde ophalen voor:', address);

            // API aanroep naar Kadaster
            const response = await axios.get(`${API_BASE_URL}/wozwaarde`, {
                params: {
                    address: address
                },
                headers: {
                    'X-Api-Key': KADASTER_API_KEY,
                    'Accept': 'application/json'
                }
            });

            // Log de API response voor debugging
            console.log('API Response:', response.data);

            // Controleer of we een geldige WOZ-waarde hebben ontvangen
            if (!response.data || !response.data.wozWaarde) {
                throw new Error('Geen WOZ-waarde gevonden voor dit adres');
            }

            // Return alleen de benodigde data
            return {
                wozValue: response.data.wozWaarde,      // De WOZ-waarde van het pand
                peildatum: response.data.peildatum,     // Datum van de waardering
                gebruiksdoel: response.data.gebruiksdoel // Bijv. woning, kantoor, etc.
            };

        } catch (error) {
            // Uitgebreide error logging voor debugging
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            // Specifieke error handling voor verschillende scenario's
            if (error.response?.status === 401) {
                throw new Error('Ongeldige API key');
            }
            
            if (error.response?.status === 404) {
                throw new Error('Adres niet gevonden');
            }
            
            // Algemene error handling
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Kon WOZ-waarde niet ophalen'
            );
        }
    }

    /**
     * Haalt WOZ-waarden op voor meerdere adressen tegelijk
     * @param {Array<string>} addresses - Array met adressen
     * @returns {Array<Object>} - Array met WOZ-waarden voor alle adressen
     */
    async getMultipleWOZValues(addresses) {
        try {
            // Maak een array van promises voor alle adressen
            const promises = addresses.map(address => this.getWOZValue(address));
            // Wacht tot alle WOZ-waarden zijn opgehaald
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error bij ophalen meerdere WOZ-waarden:', error);
            throw new Error('Kon WOZ-waarden niet ophalen');
        }
    }
}

// Exporteer een instantie van de service voor gebruik in de applicatie
export const kadasterService = new KadasterService();
