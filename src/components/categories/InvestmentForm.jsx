import React from 'react';
import '../../styles/Modal.css';

const InvestmentForm = ({
    onSave,
    onClose,
    isLoading,
    newStock,
    setNewStock,
    addError
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Voeg Aandeel Toe</h3>
                <div className="form-group">
                    <label>Ticker Symbol</label>
                    <input
                        type="text"
                        value={newStock.ticker}
                        onChange={(e) => setNewStock({
                            ...newStock, 
                            ticker: e.target.value.toUpperCase()
                        })}
                        placeholder="bijv. AAPL"
                    />
                </div>
                <div className="form-group">
                    <label>Aantal Aandelen</label>
                    <input
                        type="number"
                        value={newStock.shares}
                        onChange={(e) => setNewStock({
                            ...newStock, 
                            shares: e.target.value
                        })}
                        placeholder="0"
                        min="0"
                        step="1"
                    />
                </div>
                {addError && (
                    <div className="error-message">
                        {addError}
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
                        onClick={onSave}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Bezig...' : 'Toevoegen'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestmentForm; 