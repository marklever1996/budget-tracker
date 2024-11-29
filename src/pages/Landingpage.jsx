import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/LandingPage.css";

const Landingpage = () => {
    return (
        <>
            <main>
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
                    <img src="/placeholder.svg" alt="FinancePro dashboard voorbeeld" />
                </div>
                </section>

                <section className="features">
                <h2>Alles wat je nodig hebt om je financiën te beheren</h2>
                <p>
                    Met FinancePro heb je alle tools in handen om je financiële doelen te bereiken. Van budgettering tot investeringsplanning, wij hebben het allemaal.
                </p>
                <div className="feature-grid">
                    <div className="feature-item">
                    <h3>Geautomatiseerde budgettering</h3>
                    <p>Koppel je bankrekeningen en laat FinancePro automatisch je uitgaven categoriseren en je budget beheren.</p>
                    </div>
                    <div className="feature-item">
                    <h3>FIRE Calculator</h3>
                    <p>Plan je weg naar financiële onafhankelijkheid met onze geavanceerde FIRE (Financial Independence, Retire Early) calculator.</p>
                    </div>
                    <div className="feature-item">
                    <h3>Investeringstracking</h3>
                    <p>Houd al je investeringen bij op één plek en krijg inzicht in je portfolio prestaties.</p>
                    </div>
                    <div className="feature-item">
                    <h3>Financiële doelen</h3>
                    <p>Stel persoonlijke financiële doelen en volg je voortgang met onze intuïtieve dashboards.</p>
                    </div>
                </div>
                </section>
            </main>
            {/* <Footer /> */}
        </>
    );
};

export default Landingpage;
