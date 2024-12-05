// Dit is de service voor de RDW API, waarmee de waarde van voertuigen kan worden berekend
// De berekening wordt gedaan op basis van de RDW data

import axios from 'axios';

class RdwService {
    constructor() {
        this.client = axios.create({
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    async getVehicleValue(kenteken) {
        try {
            console.log('Fetching data for kenteken:', kenteken);
            const cleanKenteken = kenteken.replace(/-/g, '').toUpperCase();
            
            // Gebruik de juiste endpoints
            const basisUrl = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json';
            const kenmerkenUrl = 'https://opendata.rdw.nl/resource/qyrd-w56j.json';
            
            // Parallel requests voor betere performance
            const [basisResponse, kenmerkenResponse] = await Promise.all([
                this.client.get(`${basisUrl}?kenteken=${cleanKenteken}`),
                this.client.get(`${kenmerkenUrl}?kenteken=${cleanKenteken}`)
            ]);

            console.log('API Responses:', {
                basis: basisResponse.data,
                kenmerken: kenmerkenResponse.data
            });

            if (basisResponse.data?.[0]) {
                const vehicle = {
                    ...basisResponse.data[0],
                    ...kenmerkenResponse.data?.[0]
                };

                console.log('Combined vehicle data:', vehicle);

                // Bereken waarde
                const bouwjaar = Number(vehicle.datum_eerste_toelating?.substring(0, 4));
                const leeftijd = new Date().getFullYear() - bouwjaar;
                
                // Haal basiswaarde op voor dit model
                const basisWaarde = this.getBasisMarktwaarde(vehicle.merk, vehicle.handelsbenaming);
                
                // Bereken factoren
                const leeftijdFactor = Math.max(0.2, 1 - (leeftijd * 0.08));
                const brandstofFactor = this.getBrandstofFactor(vehicle.brandstof_omschrijving);
                const typeFactor = this.getVoertuigTypeFactor(vehicle.voertuigsoort);
                const kilometerstandFactor = this.getKilometerstandFactor(vehicle.kilometerstand);
                const staatFactor = this.getStaatFactor(vehicle.staat);
                const schadeFactor = this.getSchadeFactor(vehicle.schade);

                const geschatteWaarde = basisWaarde * 
                    leeftijdFactor * 
                    brandstofFactor * 
                    typeFactor * 
                    kilometerstandFactor * 
                    staatFactor * 
                    schadeFactor;

                console.log('Waarde berekening:', {
                    basisWaarde,
                    leeftijd,
                    leeftijdFactor,
                    brandstofFactor,
                    typeFactor,
                    kilometerstandFactor,
                    staatFactor,
                    schadeFactor,
                    geschatteWaarde
                });

                return {
                    kenteken: vehicle.kenteken,
                    merk: vehicle.merk,
                    model: vehicle.handelsbenaming,
                    bouwjaar: bouwjaar,
                    brandstof: vehicle.brandstof_omschrijving || 'Onbekend',
                    geschatteWaarde: Math.round(geschatteWaarde)
                };
            }
            
            throw new Error(`Geen voertuiggegevens gevonden voor kenteken ${kenteken}`);
            
        } catch (error) {
            console.error('RDW API error:', error);
            throw new Error('Kon geen voertuiggegevens ophalen. Controleer het kenteken.');
        }
    }

    // Helper functies voor waardebepaling
    getBrandstofFactor(brandstof) {
        const factoren = {
            'Benzine': 1.0,
            'Diesel': 0.9,
            'Elektrisch': 1.2,
            'Hybride': 1.1,
            'LPG': 0.85
        };
        return factoren[brandstof] || 1.0;
    }

    getVoertuigTypeFactor(type) {
        const factoren = {
            'Personenauto': 1.0,
            'Bedrijfsauto': 0.9,
            'Motor': 0.8,
            'Aanhangwagen': 0.7
        };
        return factoren[type] || 1.0;
    }

    // Helper functie voor basis marktwaarde als catalogusprijs ontbreekt
    getBasisMarktwaarde(merk, model) {
        const basisWaarden = {
            'MERCEDES-BENZ': {
                'CLA': 35000,
                'CLA 200': 38000,
                'A-KLASSE': 32000,
                'C-KLASSE': 42000,
                'E-KLASSE': 48000,
                'default': 40000
            },
            'BMW': {
                '1-SERIE': 32000,
                '3-SERIE': 42000,
                '5-SERIE': 48000,
                'X1': 38000,
                'X3': 45000,
                'default': 40000
            },
            'AUDI': {
                'A3': 32000,
                'A4': 38000,
                'A6': 45000,
                'Q3': 36000,
                'Q5': 42000,
                'default': 38000
            },
            'CITROEN': {
                'C3': 15000,
                'C4': 18000,
                'C5': 22000,
                'default': 16000
            },
            'FIAT': {
                'PANDA': 12000,
                '500': 15000,
                'default': 15000
            },
            'VOLKSWAGEN': {
                'GOLF': 22000,
                'POLO': 18000,
                'PASSAT': 25000,
                'default': 20000
            },
            'PEUGEOT': {
                '208': 16000,
                '308': 20000,
                'default': 17000
            },
            'RENAULT': {
                'CLIO': 15000,
                'MEGANE': 18000,
                'default': 16000
            },
            'default': 20000  // Verhoogd voor onbekende merken
        };

        // Zoek eerst op exact model
        const merkWaarden = basisWaarden[merk] || { default: basisWaarden.default };
        let basisWaarde = merkWaarden[model];

        // Als exact model niet gevonden, zoek op gedeeltelijke match
        if (!basisWaarde) {
            const modelKey = Object.keys(merkWaarden).find(key => 
                model.includes(key) || key.includes(model)
            );
            basisWaarde = modelKey ? merkWaarden[modelKey] : merkWaarden.default;
        }

        return basisWaarde;
    }

    // Extra waarde-factoren
    getKilometerstandFactor(kilometers) {
        if (kilometers < 50000) return 1.1;
        if (kilometers < 100000) return 1.0;
        if (kilometers < 150000) return 0.9;
        if (kilometers < 200000) return 0.8;
        return 0.7;
    }

    getStaatFactor(staat) {
        const factoren = {
            'excellent': 1.1,
            'good': 1.0,
            'fair': 0.9,
            'poor': 0.8
        };
        return factoren[staat] || 1.0;
    }

    getSchadeFactor(schade) {
        const factoren = {
            'yes': 1.0,
            'minor': 0.9,
            'major': 0.7
        };
        return factoren[schade] || 1.0;
    }
}

export const rdwService = new RdwService(); 