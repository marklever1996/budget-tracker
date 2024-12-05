import { FaCheck } from 'react-icons/fa';
import './PricingPlans.css';

const PricingPlans = () => {
    const plans = [
        {
            name: "Basis",
            price: "Gratis",
            features: [
                "Basis budgettering",
                "Uitgaven tracking",
                "Maandelijks overzicht",
                "Basis FIRE calculator"
            ],
            isPopular: false
        },
        {
            name: "Pro",
            price: "€1.99",
            period: "/maand",
            features: [
                "Alles uit Basis",
                "Geavanceerde budgettering",
                "Vermogensbeheer",
                "Uitgebreide FIRE calculator",
                "Realtime synchronisatie",
                "Prioriteit support"
            ],
            isPopular: true
        },
        {
            name: "Familie",
            price: "€4.99",
            period: "/maand",
            features: [
                "Alles uit Pro",
                "Tot 5 gebruikers",
                "Gedeelde budgetten",
                "Familie doelen",
                "Gezamenlijke rapportages"
            ],
            isPopular: false
        }
    ];

    return (
        <section className="pricing-section">
            <div className="pricing-container">
                <h2 className="pricing-title fade-in">
                    Kies het plan dat bij je past
                </h2>
                <p className="pricing-description fade-in">
                    Start gratis en upgrade wanneer je er klaar voor bent
                </p>
                
                <div className="pricing-grid">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`pricing-card fade-in ${plan.isPopular ? 'popular' : ''}`}
                        >
                            {plan.isPopular && (
                                <div className="popular-badge">Meest gekozen</div>
                            )}
                            <h3 className="plan-name">{plan.name}</h3>
                            <div className="plan-price">
                                <span className="price">{plan.price}</span>
                                {plan.period && <span className="period">{plan.period}</span>}
                            </div>
                            <ul className="feature-list">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex}>
                                        <FaCheck className="check-icon" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className={`plan-button ${plan.isPopular ? 'popular' : ''}`}>
                                Start {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingPlans;