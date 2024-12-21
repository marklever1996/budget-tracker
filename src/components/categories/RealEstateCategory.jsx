import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useRealEstate } from '../../hooks/useRealEstate';
import RealEstateForm from './RealEstateForm';
import './CategoryCard.css';

const RealEstateCategory = ({ onValueChange }) => {
    const { properties, totalRealEstateValue, isLoading, error, addProperty, removeProperty } = useRealEstate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProperty, setNewProperty] = useState({ 
        postcode: '', 
        huisnummer: '' 
    });
    const [addError, setAddError] = useState(null);

    useEffect(() => {
        if (totalRealEstateValue !== undefined && onValueChange) {
            const value = Number(totalRealEstateValue) || 0;
            onValueChange(value);
        }
    }, [totalRealEstateValue]);

    const handleAddProperty = async () => {
        if (!newProperty.postcode || !newProperty.huisnummer) {
            setAddError('Vul alle velden in');
            return;
        }

        try {
            const address = `${newProperty.postcode} ${newProperty.huisnummer}`;
            await addProperty(address);
            setShowAddModal(false);
            setNewProperty({ postcode: '', huisnummer: '' });
            setAddError(null);
        } catch (error) {
            setAddError(error.message);
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setNewProperty({ postcode: '', huisnummer: '' });
        setAddError(null);
    };

    return (
        <div className="category-content">
            <div className="items-list">
                {properties.map(property => (
                    <div key={property.address} className="item">
                        <div className="item-info">
                            <span className="item-primary">{property.address}</span>
                            <span className="item-secondary">
                                Laatste update: {new Date(property.lastUpdated).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="item-value">
                            <span className="current-value">
                                €{property.wozValue?.toLocaleString()}
                            </span>
                        </div>
                        <button 
                            className="remove-item"
                            onClick={() => removeProperty(property.address)}
                            aria-label={`Verwijder ${property.address}`}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <button 
                className="add-button"
                onClick={() => setShowAddModal(true)}
            >
                <FaPlus /> Voeg Woning Toe
            </button>

            {showAddModal && (
                <RealEstateForm
                    onSave={handleAddProperty}
                    onClose={handleCloseModal}
                    isLoading={isLoading}
                    error={error}
                    newProperty={newProperty}
                    setNewProperty={setNewProperty}
                    addError={addError}
                />
            )}
        </div>
    );
};

export default RealEstateCategory; 