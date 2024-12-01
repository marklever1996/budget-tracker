import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/FireCalculator.css';

const FireCalculator = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="fire-calculator">
            <div className="calculator-container">
                {/* Header sectie */}
                <div className="calculator-header">
                    <h1>FIRE Calculator</h1>
                    <p>Bereken je weg naar financiële onafhankelijkheid</p>
                </div>

                {/* Huidige Financiële Situatie */}
                <section className="calculator-section">
                    <h2>Huidige Financiële Situatie</h2>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Leeftijd</label>
                            <input type="number" placeholder="Bijv. 30" />
                        </div>
                        <div className="input-group">
                            <label>Netto maandinkomen</label>
                            <input type="number" placeholder="€" />
                        </div>
                        <div className="input-group">
                            <label>Maandelijkse uitgaven</label>
                            <input type="number" placeholder="€" />
                        </div>
                        <div className="input-group">
                            <label>Huidige besparingen</label>
                            <input type="number" placeholder="€" />
                        </div>
                    </div>
                </section>

                {/* Investeringsprofiel */}
                <section className="calculator-section">
                    <h2>Investeringsprofiel</h2>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Risicoprofiel</label>
                            <select>
                                <option value="conservative">Conservatief (4-6%)</option>
                                <option value="moderate">Gematigd (6-8%)</option>
                                <option value="aggressive">Agressief (8-10%)</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Verwacht rendement</label>
                            <input type="number" placeholder="%" />
                        </div>
                        <div className="input-group">
                            <label>Inflatie aanname</label>
                            <input type="number" placeholder="%" defaultValue="2" />
                        </div>
                    </div>
                </section>

                {/* FIRE Doelen */}
                <section className="calculator-section">
                    <h2>FIRE Doelen</h2>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Gewenste FIRE leeftijd</label>
                            <input type="number" placeholder="Bijv. 45" />
                        </div>
                        <div className="input-group">
                            <label>Gewenst maandelijks inkomen bij FIRE</label>
                            <input type="number" placeholder="€" />
                        </div>
                        <div className="input-group">
                            <label>Levensstijl na FIRE</label>
                            <select>
                                <option value="lean">Lean FIRE (minimaal)</option>
                                <option value="regular">Regular FIRE (comfortabel)</option>
                                <option value="fat">Fat FIRE (luxe)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Resultaten */}
                <section className="calculator-section results">
                    <h2>Resultaten</h2>
                    <div className="results-grid">
                        <div className="result-card">
                            <h3>Benodigd FIRE vermogen</h3>
                            <span className="amount">€750.000</span>
                            <p>Gebaseerd op 4% regel</p>
                        </div>
                        <div className="result-card">
                            <h3>Jaren tot FIRE</h3>
                            <span className="amount">15</span>
                            <p>Bij huidige spaarrate</p>
                        </div>
                        <div className="result-card">
                            <h3>Benodigde maandelijkse investering</h3>
                            <span className="amount">€2.500</span>
                            <p>Om doel te bereiken</p>
                        </div>
                        <div className="result-card">
                            <h3>Spaarrate</h3>
                            <span className="amount">45%</span>
                            <p>Van netto inkomen</p>
                        </div>
                    </div>
                </section>

                {/* Actie knoppen */}
                <div className="action-buttons">
                    <button className="secondary" onClick={() => navigate('/dashboard')}>
                        Terug naar Dashboard
                    </button>
                    <button className="primary">
                        Bereken
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FireCalculator; 