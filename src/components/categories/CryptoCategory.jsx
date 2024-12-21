import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useCrypto } from '../../hooks/useCrypto';
import CryptoForm from './CryptoForm';
import './CategoryCard.css';

const CryptoCategory = ({ onValueChange }) => {
    const { 
        cryptos, 
        totalCryptoValue, 
        isLoading, 
        error, 
        addCrypto, 
        removeCrypto 
    } = useCrypto();
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCrypto, setNewCrypto] = useState({ symbol: '', amount: '' });
    const [addError, setAddError] = useState(null);

    useEffect(() => {
        if (totalCryptoValue !== undefined) {
            onValueChange(totalCryptoValue);
        }
    }, [totalCryptoValue, onValueChange]);

    const handleAddCrypto = async () => {
        if (!newCrypto.symbol || !newCrypto.amount) {
            setAddError('Vul alle velden in');
            return;
        }

        try {
            setAddError(null);
            await addCrypto(newCrypto.symbol.toUpperCase(), newCrypto.amount);
            setShowAddModal(false);
            setNewCrypto({ symbol: '', amount: '' });
        } catch (error) {
            console.error('Error adding crypto:', error);
            setAddError(error.message);
        }
    };

    const handleRemoveCrypto = async (symbol) => {
        try {
            await removeCrypto(symbol);
        } catch (error) {
            console.error('Error removing crypto:', error);
        }
    };

    return (
        <div className="category-content">
            <div className="items-list">
                {cryptos.map(crypto => (
                    <div key={crypto.symbol} className="item">
                        <div className="item-info">
                            <span className="item-primary">{crypto.symbol}</span>
                            <span className="item-secondary">
                                {Number(crypto.amount).toLocaleString()} coins
                            </span>
                        </div>
                        <div className="item-value">
                            <span className="current-value">
                                €{crypto.value.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </span>
                            <span className={`change-percentage ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                                {crypto.change24h.toFixed(2)}%
                            </span>
                        </div>
                        <button 
                            className="remove-item"
                            onClick={() => handleRemoveCrypto(crypto.symbol)}
                            disabled={isLoading}
                            aria-label={`Verwijder ${crypto.symbol}`}
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
                disabled={isLoading}
            >
                <FaPlus /> <span>Voeg Crypto Toe</span>
            </button>

            {showAddModal && (
                <CryptoForm
                    onSave={handleAddCrypto}
                    onClose={() => {
                        setShowAddModal(false);
                        setNewCrypto({ symbol: '', amount: '' });
                        setAddError(null);
                    }}
                    isLoading={isLoading}
                    newCrypto={newCrypto}
                    setNewCrypto={setNewCrypto}
                    addError={addError}
                />
            )}
        </div>
    );
};

export default CryptoCategory; 