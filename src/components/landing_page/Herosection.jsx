import { FaChevronDown } from 'react-icons/fa';
import './Herosection.css';

const HeroSection = () => {
    return (
        <section className="hero">
                <div className="hero-content">
                    <h1>Neem controle over je financiën met FinancePro</h1>
                    <p>
                    FinancePro biedt je de tools om je uitgaven te beheren, je spaardoelen te bereiken en je financiële toekomst te plannen. Met onze geavanceerde budgettering en FIRE-calculator ben je op weg naar financiële onafhankelijkheid.
                    </p>
                    <div className="cta-buttons">
                    <button className="btn btn-primary">Aan de slag</button>
                    <button className="btn btn-link">Meer informatie →</button>
                    </div>
                </div>
                <div className="hero-image">
                    {/* <img src={LandingpageBanner} alt="FinancePro dashboard" /> */}
                </div>
        </section>
    );
};

export default HeroSection;

