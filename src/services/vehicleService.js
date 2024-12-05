// Dit is de database voor de voertuigen

import { db } from '../firebase-config';
import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

class VehicleService {
    constructor() {
        this.collection = 'vehicles';
    }

    async saveVehicle(userId, vehicleData) {
        if (!userId) {
            throw new Error('Gebruiker moet ingelogd zijn om voertuigen op te slaan');
        }

        try {
            const vehicleRef = doc(db, this.collection, `${userId}_${vehicleData.kenteken}`);
            
            // Voeg timestamp en userId toe
            const vehicleWithMeta = {
                ...vehicleData,
                userId,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await setDoc(vehicleRef, vehicleWithMeta);
            return vehicleWithMeta;
        } catch (error) {
            console.error('Error saving vehicle:', error);
            if (error.code === 'permission-denied') {
                throw new Error('Geen toegang tot de database. Controleer of je bent ingelogd.');
            }
            throw error;
        }
    }

    async getUserVehicles(userId) {
        if (!userId) {
            throw new Error('Gebruiker moet ingelogd zijn om voertuigen op te halen');
        }

        try {
            const vehiclesRef = collection(db, this.collection);
            const q = query(vehiclesRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate()
            }));
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            if (error.code === 'permission-denied') {
                throw new Error('Geen toegang tot de database. Controleer of je bent ingelogd.');
            }
            throw error;
        }
    }
}

export const vehicleService = new VehicleService(); 