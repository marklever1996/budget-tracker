import React, { useState } from 'react';
import { rdwService } from '../../services/rdwService';
import './CategoryCard.css';

const VehicleForm = ({ vehicle, onSave, onClose, isLoading, error }) => {
    const [formData, setFormData] = useState({
        kenteken: vehicle?.kenteken || '',
        kilometerstand: vehicle?.kilometerstand || '',
        staat: vehicle?.staat || '',
        schadevrij: vehicle?.schadevrij || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const rdwData = await rdwService.getVehicleValue(formData.kenteken);
            const completeData = {
                ...rdwData,
                kilometerstand: Number(formData.kilometerstand),
                staat: formData.staat,
                schadevrij: formData.schadevrij
            };
            
            onSave(completeData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Voeg Voertuig Toe</h3>
                <div className="form-group">
                    <label>Kenteken</label>
                    <input
                        type="text"
                        value={formData.kenteken}
                        onChange={handleChange}
                        placeholder="AB-123-C"
                    />
                </div>
                <div className="form-group">
                    <label>Kilometerstand</label>
                    <input
                        type="number"
                        value={formData.kilometerstand}
                        onChange={handleChange}
                        placeholder="Bijv. 120000"
                    />
                </div>
                <div className="form-group">
                    <label>Staat van het voertuig</label>
                    <select 
                        name="staat"
                        value={formData.staat}
                        onChange={handleChange}
                    >
                        <option value="">Selecteer staat</option>
                        <option value="excellent">Uitstekend - Als nieuw</option>
                        <option value="good">Goed - Normale gebruikssporen</option>
                        <option value="fair">Redelijk - Zichtbare slijtage</option>
                        <option value="poor">Matig - Veel slijtage/schade</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Schadevrij</label>
                    <select 
                        name="schadevrij"
                        value={formData.schadevrij}
                        onChange={handleChange}
                    >
                        <option value="">Selecteer schadehistorie</option>
                        <option value="yes">Volledig schadevrij</option>
                        <option value="minor">Kleine schades gehad</option>
                        <option value="major">Grote schades gehad</option>
                    </select>
                </div>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <div className="modal-actions">
                    <button 
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Annuleren
                    </button>
                    <button 
                        className="save-button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Bezig...' : 'Toevoegen'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleForm; 