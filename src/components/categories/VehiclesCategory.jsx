import React, { useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useVehicles } from '../../hooks/useVehicles';
import VehicleForm from './VehicleForm';
import './CategoryCard.css';
import '../../styles/Modal.css';

const VehiclesCategory = ({ onValueChange }) => {
    const {
        vehicles,
        totalVehicleValue,
        isLoading,
        error,
        showModal,
        selectedVehicle,
        handleAddVehicle,
        handleEditVehicle,
        handleSaveVehicle,
        setShowModal,
        handleDeleteVehicle
    } = useVehicles();

    // Update parent wanneer totalVehicleValue verandert
    useEffect(() => {
        if (totalVehicleValue !== undefined) {
            onValueChange(totalVehicleValue);
        }
    }, [totalVehicleValue, onValueChange]);

    if (!vehicles.length) {
        return (
            <div className="category-content">
                <button 
                    className="add-button"
                    onClick={handleAddVehicle}
                >
                    <FaPlus /> <span>Voeg Voertuig Toe</span>
                </button>
            </div>
        );
    }

    return (
        <div className="category-content">
            <div className="items-list">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.kenteken} className="item">
                        <div className="item-header">
                            <div className="title-section">
                                <span className="item-primary">
                                    {vehicle.merk} {vehicle.model}
                                </span>
                                <button 
                                    className="edit-button-category"
                                    onClick={() => handleEditVehicle(vehicle)}
                                    aria-label={`Wijzig ${vehicle.merk} ${vehicle.model}`}
                                >
                                    <FaEdit size={14} />
                                </button>
                            </div>
                            <button 
                                className="delete-button"
                                onClick={() => handleDeleteVehicle(vehicle)}
                                aria-label={`Verwijder ${vehicle.merk} ${vehicle.model}`}
                            >
                                <FaTrash size={14} />
                                <span className="delete-popup">Klik om te verwijderen</span>
                            </button>
                        </div>
                        <div className="item-content">
                            <span className="item-secondary">
                                Bouwjaar {vehicle.bouwjaar}
                            </span>
                            <div className="item-value">
                                <span className="current-value">
                                    €{vehicle.geschatteWaarde?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                className="add-button"
                onClick={handleAddVehicle}
            >
                <FaPlus /> <span>Voeg Voertuig Toe</span>
            </button>

            {showModal && (
                <VehicleForm
                    vehicle={selectedVehicle}
                    onSave={handleSaveVehicle}
                    onClose={() => setShowModal(false)}
                    isLoading={isLoading}
                    error={error}
                />
            )}
        </div>
    );
};

export default VehiclesCategory;