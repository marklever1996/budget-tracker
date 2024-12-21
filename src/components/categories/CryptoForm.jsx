import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import '../../styles/Modal.css';

const CryptoForm = ({
    onSave,
    onClose,
    isLoading,
    newCrypto,
    setNewCrypto,
    addError
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <form onSubmit={handleSubmit}>
                    <h3>Voeg Crypto Toe</h3>
                    <div className="form-group">
                        <label htmlFor="crypto-symbol">Crypto Symbol</label>
                        <input
                            id="crypto-symbol"
                            type="text"
                            value={newCrypto.symbol}
                            onChange={(e) => setNewCrypto({
                                ...newCrypto, 
                                symbol: e.target.value.toUpperCase()
                            })}
                            placeholder="bijv. BTC, ETH, ADA"
                            disabled={isLoading}
                            required
                        />
                        <span className="input-description">
                            Voer het symbool van de cryptocurrency in
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="crypto-amount">Aantal Coins</label>
                        <input
                            id="crypto-amount"
                            type="number"
                            value={newCrypto.amount}
                            onChange={(e) => setNewCrypto({
                                ...newCrypto, 
                                amount: e.target.value
                            })}
                            placeholder="0.00"
                            min="0"
                            step="any"
                            disabled={isLoading}
                            required
                        />
                        <span className="input-description">
                            Voer het aantal coins in dat je bezit
                        </span>
                    </div>
                    {addError && (
                        <div className="error-message">
                            {addError}
                        </div>
                    )}
                    <div className="modal-actions">
                        <button 
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Annuleren
                        </button>
                        <button 
                            type="submit"
                            className="save-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Bezig...
                                </>
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

export default CryptoForm; 