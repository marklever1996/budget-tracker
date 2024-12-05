import axios from 'axios';

class WozService {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2',
            headers: {
                'X-Api-Key': import.meta.env.VITE_WOZ_API_KEY,
                'Content-Type': 'application/json'
            }
        });
    }

    async getWozValue(address) {
        try {
            // 1. Eerst het BAG ID ophalen met het adres
            const bagResponse = await this.client.get('/adressen', {
                params: {
                    postcode: address.postcode,
                    huisnummer: address.huisnummer
                }
            });

            const bagId = bagResponse.data.nummeraanduidingen[0].identificatiecode;

            // 2. Dan de WOZ-waarde ophalen met het BAG ID
            const wozResponse = await this.client.get(`/wozobjecten/${bagId}`);
            
            return {
                value: wozResponse.data.vastgesteldeWaarde,
                peildatum: wozResponse.data.waardepeildatum,
                lastUpdated: new Date()
            };
        } catch (error) {
            console.error('WOZ API error:', error);
            throw error;
        }
    }
}

export const wozService = new WozService(); 