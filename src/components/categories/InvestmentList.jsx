import React from 'react';
import { FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './InvestmentList.css';

// Deze component toont een individueel aandeel in de portefeuille
const InvestmentList = ({ stock, onRemove }) => {
    // Bepaal of de waardeverandering positief of negatief is
    const isPositive = stock.change >= 0;
    // Bereken de prijs per aandeel (totale waarde gedeeld door aantal aandelen)
    const pricePerShare = stock.value / stock.shares;
    
    return (
        // Container voor een individueel aandeel
        <div className="investment-item">
            {/* Hoofdinhoud van het aandeel */}
            <div className="investment-item__content">
                {/* Bovenste rij: Ticker symbool en totale waarde */}
                <div className="investment-item__row">
                    <h3 className="investment-item__ticker">{stock.ticker}</h3>
                    <span className="investment-item__total">
                        €{stock.value.toLocaleString()}
                    </span>
                </div>
                {/* Onderste rij: Prijs per aandeel x aantal, en percentage verandering */}
                <div className="investment-item__row">
                    <span className="investment-item__price">
                        €{pricePerShare.toLocaleString()} x {stock.shares}
                    </span>
                    {/* Percentage verandering met pijl omhoog/omlaag */}
                    <div className={`investment-item__change ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                        <span>{Math.abs(stock.change)}%</span>
                    </div>
                </div>
            </div>
            {/* Verwijder knop (alleen zichtbaar bij hover) */}
            <button 
                className="investment-item__remove"
                onClick={() => onRemove(stock.ticker)}
                aria-label={`Verwijder ${stock.ticker}`}
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default InvestmentList; 