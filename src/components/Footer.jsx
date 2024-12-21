import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaShieldAlt, FaArrowUp } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>FinancePro</h3>
                    <p>Uw vertrouwde partner voor persoonlijk vermogensbeheer en financiële planning.</p>
                    <div className="security-badge">
                        <FaShieldAlt />
                        <span>Bank-level security</span>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Functionaliteiten</h4>
                    <ul>
                        <li><Link to="/investments">Vermogensbeheer</Link></li>
                        <li><Link to="/budget">Budgettering</Link></li>
                        <li><Link to="/fire">FIRE Planning</Link></li>
                        <li><Link to="/budget-calculator">Financiële Tools</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Ondersteuning</h4>
                    <ul>
                        <li><Link to="/help">Help Centrum</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><a href="mailto:support@financepro.nl">leverwebdesign@gmail.com</a></li>
                        <li><a href="tel:+31501234567">+31 639131017</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Juridisch</h4>
                    <ul>
                        <li><Link to="/privacy">Privacyverklaring</Link></li>
                        <li><Link to="/terms">Algemene Voorwaarden</Link></li>
                        <li><Link to="/security">Veiligheid & Compliance</Link></li>
                        <li><Link to="/disclaimer">Disclaimer</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-info">
                    <p>
                        &copy; {currentYear} LeverWebDesign | KvK: 94208603 | 
                        <span className="address">Hyacinthstraat 198, 9713XL Groningen</span>
                    </p>
                    <p className="compliance">
                        Geregistreerd bij de Autoriteit Financiële Markten (AFM)
                    </p>
                </div>
                <button className="scroll-top" onClick={scrollToTop} aria-label="Scroll naar boven">
                    <FaArrowUp />
                </button>
            </div>
        </footer>
    );
};

export default Footer;
