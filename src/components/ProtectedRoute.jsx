import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute; 

// Deze ProtectedRoute zorgt ervoor dat alleen ingelogde gebruikers toegang hebben tot de 
// pagina's die beschermd zijn.
// Als de gebruiker niet is ingelogd, wordt deze doorgestuurd naar de login pagina.
