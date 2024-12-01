// src/services/saltEdgeService.js
import axios from 'axios';

class SaltEdgeService {
    constructor() {
        this.client = axios.create({
            baseURL: process.env.REACT_APP_SALT_EDGE_API_URL,
            headers: {
                'App-id': process.env.REACT_APP_SALT_EDGE_APP_ID,
                'Secret': process.env.REACT_APP_SALT_EDGE_SECRET,
                'Content-Type': 'application/json'
            }
        });
    }

    // Creëer een nieuwe customer
    async createCustomer(userId) {
        const response = await this.client.post('/customers', {
            data: {
                identifier: userId
            }
        });
        return response.data;
    }

    // Start een nieuwe connectie
    async createConnection(customerId) {
        const response = await this.client.post('/connect_sessions/create', {
            data: {
                customer_id: customerId,
                country_code: 'NL',
                provider_code: 'fake_bank_simple_xf',  // Voor testing
                return_to: 'http://localhost:3000/dashboard'
            }
        });
        return response.data;
    }

    // Haal transacties op
    async getTransactions(connectionId, fromDate, toDate) {
        const response = await this.client.get('/transactions', {
            params: {
                connection_id: connectionId,
                from_date: fromDate,
                to_date: toDate
            }
        });
        return response.data;
    }
}

// Exporteer een instantie van de service
export const saltEdgeService = new SaltEdgeService();