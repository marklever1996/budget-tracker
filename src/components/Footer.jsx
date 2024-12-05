import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaArrowUp } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>FinancePro</h3>
                    <p>Neem controle over je financiële toekomst met onze geavanceerde tools en inzichten.</p>
                    <div className="social-links">
                        <a href="https://github.com/marklever1996" target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </a>
                        <a href="https://www.linkedin.com/in/mark-lever-5b2b07121/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Features</h4>
                    <ul>
                        <li><Link to="/budget-calculator">Budget Calculator</Link></li>
                        <li><Link to="/fire-calculator">FIRE Calculator</Link></li>
                        <li><Link to="/investments">Vermogensoverzicht</Link></li>
                        <li><Link to="/goals">Financiële Doelen</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Resources</h4>
                    <ul>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/support">Support</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/cookies">Cookie Policy</Link></li>
                        <li><Link to="/disclaimer">Disclaimer</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    Owned & Maintained by <a href="https://www.leverwebdesign.nl" target="_blank" rel="noopener noreferrer">Leverwebdesign</a>
                </p>
                <button className="scroll-top" onClick={scrollToTop}>
                    <FaArrowUp />
                </button>
            </div>
        </footer>
    );
};

export default Footer;
