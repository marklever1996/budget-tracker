import React, { useState } from 'react';
import { FaSpinner, FaArrowRight } from 'react-icons/fa';
import '../../styles/Modal.css';
import axios from 'axios';

const RealEstateForm = ({ 
    onSave, 
    onClose, 
    isLoading: parentIsLoading, 
    newProperty,
    setNewProperty,
    addError 
}) => {
    const [phase, setPhase] = useState(1);
    const [wozWaarde, setWozWaarde] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (phase === 1) {
            try {
                setIsLoading(true);
                setError(null);

                const formattedPostcode = newProperty.postcode.replace(/\s+/g, '').toUpperCase();
                const formattedHuisnummer = newProperty.huisnummer.replace(/\s+/g, '');

                const response = await axios.get('http://localhost:5000/api/woz', {
                    params: {
                        postcode: formattedPostcode,
                        huisnummer: formattedHuisnummer
                    }
                });

                setWozWaarde(response.data.wozWaarde);
                
                setNewProperty(prev => ({
                    ...prev,
                    wozWaarde: response.data.wozWaarde,
                    peildatum: response.data.peildatum,
                    postcode: formattedPostcode,
                    huisnummer: formattedHuisnummer
                }));

            } catch (error) {
                console.error('Error fetching WOZ value:', error);
                setError(
                    error.response?.data?.message || 
                    'Kon WOZ-waarde niet ophalen. Controleer de postcode en het huisnummer.'
                );
            } finally {
                setIsLoading(false);
            }
        } else {
            onSave();
        }
    };

    // Fase 1: Adresgegevens en WOZ-waarde ophalen
    const renderPhaseOne = () => (
        <>
            <h3>Stap 1: Adresgegevens</h3>
            <div className="form-section">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="postcode">Postcode</label>
                        <input
                            id="postcode"
                            type="text"
                            value={newProperty.postcode}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase();
                                const formatted = value.length === 4 
                                    ? value + ' ' 
                                    : value;
                                setNewProperty({
                                    ...newProperty,
                                    postcode: formatted
                                });
                            }}
                            placeholder="1234 AB"
                            maxLength="7"
                            pattern="[0-9]{4}\s?[A-Z]{2}"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="huisnummer">Huisnummer</label>
                        <input
                            id="huisnummer"
                            type="text"
                            value={newProperty.huisnummer}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                huisnummer: e.target.value
                            })}
                            placeholder="123"
                            required
                        />
                    </div>
                </div>
            </div>

            {wozWaarde && (
                <div className="woz-result">
                    <h4>WOZ-waarde gevonden</h4>
                    <p className="woz-value">€{wozWaarde.toLocaleString()}</p>
                    <button
                        type="button"
                        className="next-button"
                        onClick={() => setPhase(2)}
                    >
                        Volgende stap <FaArrowRight />
                    </button>
                </div>
            )}
        </>
    );

    // Fase 2: Aanvullende gegevens
    const renderPhaseTwo = () => (
        <>
            <h3>Stap 2: Aanvullende gegevens</h3>
            
            {/* Aankoopgegevens */}
            <div className="form-section">
                <h4>Aankoopgegevens</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="aankoopDatum">Aankoopdatum</label>
                        <input
                            id="aankoopDatum"
                            type="date"
                            value={newProperty.aankoopDatum}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                aankoopDatum: e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="aankoopBedrag">Aankoopbedrag</label>
                        <input
                            id="aankoopBedrag"
                            type="number"
                            value={newProperty.aankoopBedrag}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                aankoopBedrag: e.target.value
                            })}
                            placeholder="€"
                            min="0"
                            step="1000"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Hypotheekgegevens */}
            <div className="form-section">
                <h4>Hypotheekgegevens</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="hypotheekBedrag">Hypotheekbedrag</label>
                        <input
                            id="hypotheekBedrag"
                            type="number"
                            value={newProperty.hypotheekBedrag}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                hypotheekBedrag: e.target.value
                            })}
                            placeholder="€"
                            min="0"
                            step="1000"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rentePercentage">Rentepercentage</label>
                        <input
                            id="rentePercentage"
                            type="number"
                            value={newProperty.rentePercentage}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                rentePercentage: e.target.value
                            })}
                            placeholder="%"
                            min="0"
                            max="100"
                            step="0.01"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="rentevastPeriode">Rentevaste periode</label>
                        <input
                            id="rentevastPeriode"
                            type="number"
                            value={newProperty.rentevastPeriode}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                rentevastPeriode: e.target.value
                            })}
                            placeholder="Jaren"
                            min="1"
                            max="30"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hypotheekVorm">Hypotheekvorm</label>
                        <select
                            id="hypotheekVorm"
                            value={newProperty.hypotheekVorm}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                hypotheekVorm: e.target.value
                            })}
                        >
                            <option value="">Selecteer type</option>
                            <option value="annuiteit">Annuïteitenhypotheek</option>
                            <option value="lineair">Lineaire hypotheek</option>
                            <option value="aflossingsvrij">Aflossingsvrije hypotheek</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Maandelijkse lasten */}
            <div className="form-section">
                <h4>Maandelijkse lasten</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="vveKosten">VvE bijdrage</label>
                        <input
                            id="vveKosten"
                            type="number"
                            value={newProperty.vveKosten}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                vveKosten: e.target.value
                            })}
                            placeholder="€ per maand"
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ozb">OZB</label>
                        <input
                            id="ozb"
                            type="number"
                            value={newProperty.ozb}
                            onChange={(e) => setNewProperty({
                                ...newProperty,
                                ozb: e.target.value
                            })}
                            placeholder="€ per jaar"
                            min="0"
                        />
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="modal-overlay">
            <div className="modal">
                <form onSubmit={handleSubmit} className="real-estate-form">
                    {/* Progress indicator */}
                    <div className="form-progress">
                        <div className={`progress-step ${phase === 1 ? 'active' : ''}`}>1</div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${phase === 2 ? 'active' : ''}`}>2</div>
                    </div>

                    {/* Render juiste fase */}
                    {phase === 1 ? renderPhaseOne() : renderPhaseTwo()}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">
                        {phase === 2 && (
                            <button 
                                type="button"
                                className="back-button"
                                onClick={() => setPhase(1)}
                            >
                                Terug
                            </button>
                        )}
                        <button 
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={isLoading || parentIsLoading}
                        >
                            Annuleren
                        </button>
                        <button 
                            type="submit"
                            className="save-button"
                            disabled={isLoading || parentIsLoading || (phase === 1 && wozWaarde)}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    WOZ-waarde ophalen...
                                </>
                            ) : phase === 1 ? (
                                'Zoek WOZ-waarde'
                            ) : (
                                'Toevoegen'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RealEstateForm; 