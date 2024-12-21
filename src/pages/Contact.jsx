import React, { useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-content">
                <div className="contact-info">
                    <h1>Neem Contact Op</h1>
                    <p className="contact-description">
                        Heeft u vragen over Budget Tracker? Wij staan klaar om u te helpen.
                        Vul het formulier in of neem direct contact met ons op.
                    </p>

                    <div className="contact-details">
                        <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <div>
                                <h3>Locatie</h3>
                                <p>Groningen, Nederland</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <div>
                                <h3>Email</h3>
                                <p>info@XXXXX.nl</p>
                            </div>
                        </div>
                        <div className="social-links">
                            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                                <FaGithub />
                            </a>
                            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Uw naam"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Uw email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Onderwerp"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Uw bericht"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Verzenden...' : 'Verstuur Bericht'}
                    </button>

                    {submitStatus === 'success' && (
                        <div className="success-message">
                            Bericht succesvol verzonden!
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="error-message">
                            Er ging iets mis. Probeer het later opnieuw.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Contact; 