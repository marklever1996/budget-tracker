import { Link } from 'react-router-dom';
import './CallToAction.css';

const CallToAction = () => {
    return (
        <section className="cta-section">
            <div className="cta-container">
                <div className="cta-content">
                    <h2 className="cta-title">
                        Klaar om je financiële toekomst vorm te geven?
                    </h2>
                    <p className="cta-description">
                        Begin vandaag nog met het beheren van je financiën en werk aan je weg naar FIRE
                    </p>
                    <div className="cta-buttons">
                        <Link to="/register" className="cta-button primary">
                            Start Gratis
                        </Link>
                        <Link to="/contact" className="cta-button secondary">
                            Neem Contact Op
                        </Link>
                    </div>
                </div>
            </div>
            <div className="cta-background"></div>
        </section>
    );
};

export default CallToAction;
