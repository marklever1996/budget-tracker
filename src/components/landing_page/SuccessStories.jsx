import React from 'react';
import { FaStar } from 'react-icons/fa';
import './SuccessStories.css';

const SuccessStories = () => {
    const stories = [
        {
            name: "Thomas de Vries",
            role: "ZZP'er",
            image: "/avatars/thomas.jpg",
            quote: "Dankzij FinancePro heb ik eindelijk grip op mijn financiën. De FIRE calculator heeft me geholpen een duidelijk pad uit te stippelen naar financiële onafhankelijkheid.",
            rating: 5
        },
        {
            name: "Lisa Jansen",
            role: "Marketing Manager",
            image: "/avatars/lisa.jpg",
            quote: "De automatische categorisering bespaart me zoveel tijd. Ik kan nu eindelijk zien waar mijn geld naartoe gaat en betere financiële beslissingen nemen.",
            rating: 5
        },
        {
            name: "Mark Bakker",
            role: "Software Developer",
            image: "/avatars/mark.jpg",
            quote: "De investeringstracking functionaliteit is geweldig. Het geeft me een duidelijk overzicht van mijn portfolio en helpt me bij het maken van investeringsbeslissingen.",
            rating: 5
        }
    ];

    return (
        <section className="success-stories">
            <div className="success-container">
                <h2 className="success-title fade-in">
                    Wat onze gebruikers zeggen
                </h2>
                <p className="success-description fade-in">
                    Ontdek hoe FinancePro anderen helpt hun financiële doelen te bereiken
                </p>

                <div className="stories-grid">
                    {stories.map((story, index) => (
                        <div key={index} className="story-card fade-in">
                            <div className="story-header">
                                <img 
                                    src={story.image} 
                                    alt={story.name}
                                    className="story-avatar"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/60';
                                    }}
                                />
                                <div className="story-meta">
                                    <h3>{story.name}</h3>
                                    <p>{story.role}</p>
                                </div>
                            </div>
                            <div className="story-rating">
                                {[...Array(story.rating)].map((_, i) => (
                                    <FaStar key={i} className="star-icon" />
                                ))}
                            </div>
                            <blockquote className="story-quote">
                                {story.quote}
                            </blockquote>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;
  

