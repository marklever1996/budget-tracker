import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './FAQ.css';

const FAQ = () => {
    const faqs = [
        {
            question: "Wat is FinancePro?",
            answer: "FinancePro is een complete financiële tool die je helpt bij het beheren van je budget, het tracken van je vermogen en het plannen van je weg naar financiële onafhankelijkheid (FIRE)."
        },
        {
            question: "Is mijn financiële data veilig?",
            answer: "Ja, we nemen beveiliging zeer serieus. Al je data wordt versleuteld opgeslagen en we gebruiken de nieuwste beveiligingstechnologieën om je gegevens te beschermen."
        },
        {
            question: "Kan ik mijn bankrekening koppelen?",
            answer: "Ja, FinancePro ondersteunt veilige koppelingen met de meeste Nederlandse banken via de PSD2-regelgeving."
        },
        {
            question: "Hoe werkt de FIRE calculator?",
            answer: "De FIRE calculator gebruikt je huidige vermogen, spaarquote en verwacht rendement om te berekenen wanneer je financieel onafhankelijk kunt zijn. Het houdt ook rekening met inflatie en verschillende scenario's."
        },
        {
            question: "Kan ik het gratis uitproberen?",
            answer: "Ja, je kunt beginnen met ons gratis Basis pakket om de belangrijkste functies uit te proberen. Upgrade naar Pro wanneer je er klaar voor bent."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <h2 className="faq-title fade-in">
                    Veelgestelde vragen
                </h2>
                <p className="faq-description fade-in">
                    Vind snel antwoord op je vragen
                </p>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item fade-in ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <FaChevronDown className="faq-icon" />
                            </div>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
  