import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useInvestments } from '../../hooks/useInvestments';
import InvestmentForm from './InvestmentForm';
import InvestmentList from './InvestmentList';
import './CategoryCard.css';

const InvestmentsCategory = ({ onValueChange }) => {
    const { stocks, totalInvestmentsValue, isLoading, error, addStock, removeStock } = useInvestments();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStock, setNewStock] = useState({ ticker: '', shares: '' });
    const [addError, setAddError] = useState(null);

    useEffect(() => {
        if (totalInvestmentsValue !== undefined) {
            onValueChange(totalInvestmentsValue);
        }
    }, [totalInvestmentsValue]);

    const handleAddStock = async () => {
        if (!newStock.ticker || !newStock.shares) {
            setAddError('Vul alle velden in');
            return;
        }

        try {
            await addStock(newStock.ticker.toUpperCase(), newStock.shares);
            setShowAddModal(false);
            setNewStock({ ticker: '', shares: '' });
            setAddError(null);
        } catch (error) {
            setAddError(error.message);
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setNewStock({ ticker: '', shares: '' });
        setAddError(null);
    };

    return (
        <div className="category-content">
            <div className="stocks-list">
                {stocks.map(stock => (
                    <InvestmentList
                        key={stock.ticker}
                        stock={stock}
                        onRemove={removeStock}
                    />
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
                <FaPlus /> <span>Voeg Aandeel Toe</span>
            </button>

            {showAddModal && (
                <InvestmentForm
                    onSave={handleAddStock}
                    onClose={handleCloseModal}
                    isLoading={isLoading}
                    newStock={newStock}
                    setNewStock={setNewStock}
                    addError={addError}
                />
            )}
        </div>
    );
};

export default InvestmentsCategory;
