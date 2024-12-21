import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { kadasterService } from '../services/kadasterService';

/**
 * Custom hook voor het beheren van onroerend goed in de portefeuille
 * Handelt alle CRUD operaties af en houdt de totale waarde bij
 */
export const useRealEstate = () => {
    // Auth context voor gebruikersgegevens
    const { user } = useAuth();
    
    // State management
    const [properties, setProperties] = useState([]); // Lijst met alle panden
    const [totalRealEstateValue, setTotalRealEstateValue] = useState(0); // Totale waarde
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error handling

    /**
     * Effect: Laad alle panden van de gebruiker bij het mounten
     * en wanneer de user verandert
     */
    useEffect(() => {
        const loadProperties = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                console.log('Panden van gebruiker laden...');
                // Haal gebruikersdata op uit Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data();
                
                if (userData?.properties) {
                    setProperties(userData.properties);
                    // Update WOZ-waarden van alle panden
                    await updatePropertyValues(userData.properties);
                } else {
                    setProperties([]);
                }
            } catch (error) {
                console.error('Error bij laden panden:', error);
                setError('Kon onroerend goed data niet laden');
            } finally {
                setIsLoading(false);
            }
        };

        loadProperties();
    }, [user]);

    /**
     * Update de WOZ-waarden van alle panden in de lijst
     * @param {Array} propertiesList - Lijst met panden om te updaten
     */
    const updatePropertyValues = async (propertiesList) => {
        if (!propertiesList.length) return;

        try {
            // Update WOZ-waarde voor elk pand
            const updatedProperties = await Promise.all(
                propertiesList.map(async (property) => {
                    const wozData = await kadasterService.getWOZValue(property.address);
                    return {
                        ...property,
                        wozValue: wozData.wozValue,
                        lastUpdated: new Date().toISOString()
                    };
                })
            );

            setProperties(updatedProperties);
            
            // Bereken en update de totale waarde
            const total = updatedProperties.reduce((sum, prop) => sum + prop.wozValue, 0);
            setTotalRealEstateValue(total);

            // Sla de geüpdatete data op in Firestore
            if (user) {
                await setDoc(doc(db, 'users', user.uid), {
                    properties: updatedProperties
                }, { merge: true });
            }
        } catch (error) {
            console.error('Error bij updaten WOZ-waarden:', error);
            setError('Kon WOZ-waarden niet updaten');
        }
    };

    /**
     * Voeg een nieuw pand toe aan de portefeuille
     * @param {string} address - Het adres van het nieuwe pand
     */
    const addProperty = async (address) => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            // Haal WOZ-waarde op voor het nieuwe pand
            const wozData = await kadasterService.getWOZValue(address);
            
            // Maak nieuw pand object
            const newProperty = {
                address,
                wozValue: wozData.wozValue,
                addedAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };

            const updatedProperties = [...properties, newProperty];

            // Update Firestore
            await setDoc(doc(db, 'users', user.uid), {
                properties: updatedProperties
            }, { merge: true });

            setProperties(updatedProperties);
            
            // Update totale waarde
            const total = updatedProperties.reduce((sum, prop) => sum + prop.wozValue, 0);
            setTotalRealEstateValue(total);

            return newProperty;
        } catch (error) {
            console.error('Error bij toevoegen pand:', error);
            throw new Error('Kon onroerend goed niet toevoegen: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Verwijder een pand uit de portefeuille
     * @param {string} address - Het adres van het te verwijderen pand
     */
    const removeProperty = async (address) => {
        if (!user) return;

        try {
            // Filter het te verwijderen pand uit de lijst
            const updatedProperties = properties.filter(prop => prop.address !== address);
            
            // Update Firestore
            await setDoc(doc(db, 'users', user.uid), {
                properties: updatedProperties
            }, { merge: true });

            setProperties(updatedProperties);
            
            // Update totale waarde
            const total = updatedProperties.reduce((sum, prop) => sum + prop.wozValue, 0);
            setTotalRealEstateValue(total);
        } catch (error) {
            console.error('Error bij verwijderen pand:', error);
            throw new Error('Kon onroerend goed niet verwijderen');
        }
    };

    // Return de benodigde data en functies
    return {
        properties,              // Lijst met alle panden
        totalRealEstateValue,   // Totale waarde van alle panden
        isLoading,              // Loading state
        error,                  // Error state
        addProperty,            // Functie voor toevoegen pand
        removeProperty,         // Functie voor verwijderen pand
        updatePropertyValues    // Functie voor updaten WOZ-waarden
    };
};
    
