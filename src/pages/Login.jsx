import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import '../styles/Login.css';
import { GoogleAuthProvider } from 'firebase/auth';

const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(formData.email, formData.password);
            navigate('/investments');
        } catch (err) {
            setError('Inloggen mislukt. Controleer je gegevens.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            await loginWithGoogle(provider);
            navigate('/investments');
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.message || 'Google login mislukt. Probeer het opnieuw.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welkom terug</h2>
                <p className="subtitle">Log in op je FinancePro account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="forgot-password">
                        <Link to="/reset-password">Wachtwoord vergeten?</Link>
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                    </button>
                </form>

                <div className="divider">
                    <span>of</span>
                </div>

                <button 
                    className="google-button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <FcGoogle size={20} />
                    <span>Login met Google</span>
                </button>

                <p className="signup-prompt">
                    Nog geen account? <Link to="/register">Registreer hier</Link>
                </p>
            </div>
        </div>
    );
};

export default Login; 