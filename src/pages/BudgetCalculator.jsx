import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/BudgetCalculator.css';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../context/BudgetContext';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';

const BudgetCalculator = () => {
    const navigate = useNavigate();
    const { updateBudgets, updateTotalBudget } = useBudget();
    
    // Haal inkomen op uit localStorage
    const [monthlyIncome, setMonthlyIncome] = useState(() => {
        return Number(localStorage.getItem('monthlyIncome')) || 0;
    });

    // Haal categorie budgetten op uit localStorage
    const [categoryBudgets, setCategoryBudgets] = useState(() => {
        const savedCategories = localStorage.getItem('categoryBudgets');
        return savedCategories ? JSON.parse(savedCategories) : {};
    });

    // Categorie definities met percentages
    const [categories, setCategories] = useState(() => {
        const savedCategories = localStorage.getItem('budgetCategories');
        return savedCategories ? JSON.parse(savedCategories) : [
            { name: 'Huisvesting', minPercent: 25, maxPercent: 35 },
            { name: 'Boodschappen', minPercent: 10, maxPercent: 15 },
            { name: 'Transport', minPercent: 10, maxPercent: 15 },
            { name: 'Utilities', minPercent: 5, maxPercent: 10 },
            { name: 'Entertainment', minPercent: 5, maxPercent: 10 },
            { name: 'Sparen', minPercent: 20, maxPercent: 20 },
            { name: 'Overig', minPercent: 5, maxPercent: 10 }
        ];
    });

    // Bereken aanbevolen bedrag voor een categorie
    const getRecommendedAmount = (minPercent, maxPercent) => {
        if (!monthlyIncome) return "0";
        const minAmount = (monthlyIncome * minPercent) / 100;
        const maxAmount = (monthlyIncome * maxPercent) / 100;
        return minPercent === maxPercent 
            ? `€${Math.round(minAmount)}`
            : `€${Math.round(minAmount)} - €${Math.round(maxAmount)}`;
    };

    // Bereken totaal budget
    const totalBudget = Object.values(categoryBudgets).reduce((sum, amount) => sum + (Number(amount) || 0), 0);
    
    // Update totaal budget in context wanneer het verandert
    useEffect(() => {
        updateTotalBudget(totalBudget);
    }, [totalBudget, updateTotalBudget]);

    // Bereken percentage van inkomen
    const budgetPercentage = monthlyIncome ? Math.round((totalBudget / monthlyIncome) * 100) : 0;

    // Update een categorie budget
    const handleCategoryChange = (categoryName, value) => {
        setCategoryBudgets(prev => ({
            ...prev,
            [categoryName]: value
        }));
    };

    const handleSave = () => {
        // Sla alles op
        updateBudgets(categoryBudgets);
        updateTotalBudget(totalBudget);
        localStorage.setItem('monthlyIncome', monthlyIncome.toString());
        localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
        
        navigate('/budget');
    };

    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', amount: '' });

    const handleAddCategory = () => {
        setShowNewCategoryModal(true);
    };

    const handleCloseModal = () => {
        setShowNewCategoryModal(false);
        setNewCategory({ name: '', amount: '' });
    };

    const handleSaveNewCategory = () => {
        if (!newCategory.name || !newCategory.amount) {
            alert('Vul beide velden in');
            return;
        }

        // Voeg nieuwe categorie toe aan categories
        const updatedCategories = [...categories, {
            name: newCategory.name,
            minPercent: 0,
            maxPercent: 100
        }];
        setCategories(updatedCategories);

        // Update category budgets
        setCategoryBudgets(prev => ({
            ...prev,
            [newCategory.name]: newCategory.amount
        }));

        // Sla de nieuwe categorieën op in localStorage
        localStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));

        // Sluit de modal en reset het formulier
        handleCloseModal();
    };

    // Voeg een useEffect toe om categorieën te bewaren
    useEffect(() => {
        localStorage.setItem('budgetCategories', JSON.stringify(categories));
    }, [categories]);

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const handleDeleteClick = (e, category) => {
        e.stopPropagation();
        setCategoryToDelete(category);
        setDeleteConfirmation(true);
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            const updatedCategories = categories.filter(cat => cat.name !== categoryToDelete.name);
            setCategories(updatedCategories);
            
            const updatedBudgets = { ...categoryBudgets };
            delete updatedBudgets[categoryToDelete.name];
            setCategoryBudgets(updatedBudgets);
            
            localStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));
            localStorage.setItem('categoryBudgets', JSON.stringify(updatedBudgets));
        }
        setDeleteConfirmation(false);
        setCategoryToDelete(null);
    };

    return (
        <div className="budget-calculator">
            <div className="calculator-container">
                <div className="calculator-header">
                    <h2>Budget Instellen</h2>
                    <p>Stel je maandelijkse budgetten in per categorie</p>
                </div>

                <div className="monthly-income-section">
                    <h3>Maandelijks Inkomen</h3>
                    <div className="budget-input">
                        <span>€</span>
                        <input 
                            type="number" 
                            placeholder="Vul je inkomen in"
                            value={monthlyIncome || ''}
                            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="budget-categories">
                    {categories.map((category, index) => (
                        <div key={index} className="budget-category">
                            <button 
                                className="delete-category"
                                onClick={(e) => handleDeleteClick(e, category)}
                                aria-label={`Verwijder ${category.name} categorie`}
                            >
                                <FaTimes />
                            </button>
                            <h3>{category.name}</h3>
                            <div className="budget-input">
                                <span>€</span>
                                <input 
                                    type="number" 
                                    placeholder={getRecommendedAmount(category.minPercent, category.maxPercent)}
                                    value={categoryBudgets[category.name] || ''}
                                    onChange={(e) => handleCategoryChange(category.name, e.target.value)}
                                />
                            </div>
                            <p className="category-tip">
                                Aanbevolen: {category.minPercent === category.maxPercent 
                                    ? `${category.minPercent}%` 
                                    : `${category.minPercent}-${category.maxPercent}%`} 
                                van je inkomen
                            </p>
                        </div>
                    ))}
                    <div className="add-category-button" onClick={handleAddCategory}>
                        <FaPlus className="plus-icon" />
                    </div>
                </div>

                <div className="total-budget-section">
                    <h3>Totaal Budget</h3>
                    <span className="total-amount">€{totalBudget}</span>
                    <p className="budget-status">
                        {budgetPercentage}% van je inkomen ingedeeld
                        {budgetPercentage > 100 && 
                            <span className="warning"> (Let op: Je hebt meer dan je inkomen ingedeeld!)</span>
                        }
                    </p>
                </div>

                <div className="action-buttons">
                    <button className="cancel-button" onClick={() => navigate('/dashboard')}>
                        Annuleren
                    </button>
                    <button className="save-button" onClick={handleSave}>
                        Opslaan
                    </button>
                </div>
            </div>

            {showNewCategoryModal && (
                <>
                    <div className="modal-overlay" onClick={handleCloseModal} />
                    <div className="new-category-modal">
                        <form className="new-category-form" onSubmit={(e) => e.preventDefault()}>
                            <h3>Nieuwe Categorie Toevoegen</h3>
                            <div className="form-group">
                                <label>Categorie Naam</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                    placeholder="Bijv. Verzekeringen, Hobby's"
                                />
                                <span className="input-description">Geef een duidelijke naam voor je nieuwe categorie</span>
                            </div>
                            <div className="form-group">
                                <label>Maandelijks Budget</label>
                                <input
                                    type="number"
                                    value={newCategory.amount}
                                    onChange={(e) => setNewCategory({...newCategory, amount: e.target.value})}
                                    placeholder="€0"
                                />
                                <span className="input-description">Voer het gewenste maandelijkse budget in</span>
                            </div>
                            <div className="modal-actions">
                                <button className="modal-cancel-button" onClick={handleCloseModal}>
                                    Annuleren
                                </button>
                                <button className="modal-save-button" onClick={handleSaveNewCategory}>
                                    Toevoegen
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {deleteConfirmation && categoryToDelete && (
                <>
                    <div className="modal-overlay" onClick={() => setDeleteConfirmation(false)} />
                    <div className="delete-confirmation-modal">
                        <div className="delete-confirmation-content">
                            <div className="delete-icon-wrapper">
                                <FaTrash />
                            </div>
                            <div>
                                <h4 className="delete-confirmation-title">Categorie Verwijderen</h4>
                                <p className="delete-confirmation-message">
                                    Weet je zeker dat je de categorie "{categoryToDelete.name}" wilt verwijderen?
                                </p>
                            </div>
                            <div className="delete-confirmation-actions">
                                <button 
                                    className="delete-cancel-button"
                                    onClick={() => setDeleteConfirmation(false)}
                                >
                                    Annuleren
                                </button>
                                <button 
                                    className="delete-confirm-button"
                                    onClick={handleConfirmDelete}
                                >
                                    Verwijderen
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BudgetCalculator; 