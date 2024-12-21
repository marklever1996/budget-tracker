import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';

const Callback = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const connectionId = params.get('connection_id');
                
                if (!connectionId) {
                    console.error('No connection ID received');
                    navigate('/investments');
                    return;
                }

                // Update user document met connection ID
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    saltEdgeConnectionId: connectionId,
                    lastUpdated: new Date()
                });

                // Redirect terug naar investments pagina
                navigate('/investments');
            } catch (error) {
                console.error('Error in callback:', error);
                navigate('/investments');
            }
        };

        if (user) {
            handleCallback();
        }
    }, [user, navigate]);

    return (
        <div className="callback-container">
            <p>Verbinding maken...</p>
        </div>
    );
};

export default Callback; 