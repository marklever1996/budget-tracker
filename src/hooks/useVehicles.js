// Deze hook is nog niet volledig, maar de basis is er
// Het is nog niet duidelijk hoe de waarde van de voertuigen moet worden opgehaald
// Deze waarde wordt niet opgeslagen in de database, maar moet handmatig worden ingevoerd

// Deze pagina zorgt ervoor dat de gebruiker voertuigen kan toevoegen, bekijken en wijzigen
// Bewaard de state voor de voertuigen (lijst, totaalwaarde)
// Bewaard in "src/pages/voertuigen.jsx"

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';

export const useVehicles = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [totalVehicleValue, setTotalVehicleValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Functie om totale waarde te berekenen
    const calculateTotalValue = (vehiclesList) => {
        return vehiclesList.reduce((sum, vehicle) => 
            sum + (vehicle.geschatteWaarde || 0), 0
        );
    };

    // Laad voertuigen bij het inloggen
    useEffect(() => {
        const loadVehicles = async () => {
            if (user) {
                try {
                    setIsLoading(true);
                    const userVehicles = await vehicleService.getUserVehicles(user.uid);
                    setVehicles(userVehicles);
                    
                    // Update totale waarde
                    const total = calculateTotalValue(userVehicles);
                    setTotalVehicleValue(total);
                } catch (error) {
                    setError('Kon voertuigen niet laden');
                    console.error('Error loading vehicles:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadVehicles();
    }, [user]);

    // Handlers
    const handleAddVehicle = () => {
        setSelectedVehicle(null);
        setShowModal(true);
    };

    const handleEditVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowModal(true);
    };

    const handleSaveVehicle = async (vehicleData) => {
        setIsLoading(true);
        setError('');

        try {
            const savedVehicle = await vehicleService.saveVehicle(user.uid, vehicleData);
            
            let updatedVehicles;
            if (selectedVehicle) {
                // Update bestaand voertuig
                updatedVehicles = vehicles.map(v => 
                    v.kenteken === savedVehicle.kenteken ? savedVehicle : v
                );
            } else {
                // Voeg nieuw voertuig toe
                updatedVehicles = [...vehicles, savedVehicle];
            }

            setVehicles(updatedVehicles);
            
            // Update totale waarde met de nieuwe lijst
            const newTotal = calculateTotalValue(updatedVehicles);
            setTotalVehicleValue(newTotal);
            
            setShowModal(false);
        } catch (error) {
            setError(error.message || 'Kon voertuig niet opslaan');
            console.error('Error saving vehicle:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // State
        vehicles,
        totalVehicleValue,
        isLoading,
        error,
        showModal,
        selectedVehicle,
        
        // Actions
        handleAddVehicle,
        handleEditVehicle,
        handleSaveVehicle,
        setShowModal
    };
};
