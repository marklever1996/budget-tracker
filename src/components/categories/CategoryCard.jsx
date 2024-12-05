import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, children }) => {
    return (
        <div className="portfolio-card">
            <div className="card-header">
                <div className="card-icon">{category.icon}</div>
                <h2>{category.name}</h2>
                <span className={`change ${category.change >= 0 ? 'positive' : 'negative'}`}>
                    {category.change}%
                </span>
            </div>
            <div className="card-value">
                €{category.value.toLocaleString()}
            </div>
            {children}
        </div>
    );
};

export default CategoryCard;
