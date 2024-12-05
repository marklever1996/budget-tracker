import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { vehicleService } from '../../services/vehicleService';
import { rdwService } from '../../services/rdwService';
import VehicleModal from './VehicleModal';
import './VehiclesCategory.css';

const VehiclesCategory = ({ onValueChange }) => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Laad voertuigen bij het inloggen
    useEffect(() => {
        const loadVehicles = async () => {
            if (user) {
                try {
                    const userVehicles = await vehicleService.getUserVehicles(user.uid);
                    setVehicles(userVehicles);
                    
                    // Update totale waarde
                    const totalValue = userVehicles.reduce((sum, vehicle) => 
                        sum + (vehicle.geschatteWaarde || 0), 0
                    );
                    onValueChange(totalValue);
                } catch (error) {
                    console.error('Error loading vehicles:', error);
                    setError('Kon voertuigen niet laden');
                }
            }
        };

        loadVehicles();
    }, [user, onValueChange]);

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
            
            if (selectedVehicle) {
                // Update bestaand voertuig
                setVehicles(prev => prev.map(v => 
                    v.kenteken === savedVehicle.kenteken ? savedVehicle : v
                ));
            } else {
                // Voeg nieuw voertuig toe
                setVehicles(prev => [...prev, savedVehicle]);
            }

            // Update totale waarde
            const totalValue = vehicles.reduce((sum, vehicle) => 
                sum + (vehicle.geschatteWaarde || 0), 0
            );
            onValueChange(totalValue);
            
            setShowModal(false);
        } catch (error) {
            console.error('Error saving vehicle:', error);
            setError(error.message || 'Kon voertuig niet opslaan');
        } finally {
            setIsLoading(false);
        }
    };

    if (!vehicles.length) {
        return (
            <div className="empty-vehicle">
                <p>Geen voertuig toegevoegd</p>
                <button 
                    className="add-vehicle-button"
                    onClick={handleAddVehicle}
                >
                    Voertuig Toevoegen
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="vehicle-list">
                {vehicles.map((vehicle, index) => (
                    <div key={index} className="vehicle-details">
                        <div className="vehicle-info">
                            <p><strong>Merk:</strong> {vehicle.merk}</p>
                            <p><strong>Model:</strong> {vehicle.model}</p>
                            <p><strong>Bouwjaar:</strong> {vehicle.bouwjaar}</p>
                            <p><strong>Waarde:</strong> €{vehicle.geschatteWaarde?.toLocaleString()}</p>
                        </div>
                        <button 
                            className="edit-vehicle-button"
                            onClick={() => handleEditVehicle(vehicle)}
                        >
                            Wijzig Voertuig
                        </button>
                    </div>
                ))}
                
                <button 
                    className="add-vehicle-button"
                    onClick={handleAddVehicle}
                >
                    + Voertuig Toevoegen
                </button>
            </div>

            {showModal && (
                <VehicleModal
                    vehicle={selectedVehicle}
                    onSave={handleSaveVehicle}
                    onClose={() => setShowModal(false)}
                    isLoading={isLoading}
                    error={error}
                />
            )}
        </>
    );
};

export default VehiclesCategory;