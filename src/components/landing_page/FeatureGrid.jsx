import { 
    FaChartPie, 
    FaBolt, 
    FaChartLine, 
    FaBullseye, 
    FaShieldAlt, 
    FaUsers 
} from 'react-icons/fa';
import './FeatureGrid.css';

const FeatureGrid = () => {
    const features = [
        {
            title: "Geautomatiseerde budgettering",
            description: "Koppel je bankrekeningen en laat FinancePro automatisch je uitgaven categoriseren en je budget beheren.",
            icon: <FaChartPie className="feature-icon-svg" />,
        },
        {
            title: "FIRE Calculator",
            description: "Plan je weg naar financiële onafhankelijkheid met onze geavanceerde FIRE (Financial Independence, Retire Early) calculator.",
            icon: <FaBolt className="feature-icon-svg" />,
        },
        {
            title: "Investeringstracking",
            description: "Houd al je investeringen bij op één plek en krijg inzicht in je portfolio prestaties.",
            icon: <FaChartLine className="feature-icon-svg" />,
        },
        {
            title: "Financiële doelen",
            description: "Stel persoonlijke financiële doelen en volg je voortgang met onze intuïtieve dashboards.",
            icon: <FaBullseye className="feature-icon-svg" />,
        },
        {
            title: "Veilige gegevensopslag",
            description: "Je financiële gegevens zijn veilig bij ons met geavanceerde encryptie en beveiligingsmaatregelen.",
            icon: <FaShieldAlt className="feature-icon-svg" />,
        },
        {
            title: "Financieel advies op maat",
            description: "Ontvang gepersonaliseerd financieel advies op basis van je unieke situatie en doelen.",
            icon: <FaUsers className="feature-icon-svg" />,
        },
    ];

    return (
        <section className="features-section">
            <div className="features-container">
                <h2 className="features-title fade-in">
                    Alles wat je nodig hebt voor je financiële reis
                </h2>
                <p className="features-description fade-in">
                    Ontdek de tools die je helpen je financiële doelen te bereiken
                </p>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card fade-in"
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid; 