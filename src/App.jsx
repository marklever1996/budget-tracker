import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landingpage from './pages/Landingpage';
import Budget from './pages/Budget';
import BudgetCalculator from './pages/BudgetCalculator';
import Investments from './pages/Investments';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BudgetProvider>
          <ErrorBoundary>
            <Header />
            <Routes>
              <Route path="/" element={<Landingpage />} />
              <Route path="/login" element={<Login />} />
              
              {/* Beveiligde routes */}
              <Route path="/investments" element={
                <ProtectedRoute>
                  <Investments />
                </ProtectedRoute>
              } />
              <Route path="/budget" element={
                <ProtectedRoute>
                  <Budget />
                </ProtectedRoute>
              } />
              <Route path="/budget-calculator" element={
                <ProtectedRoute>
                  <BudgetCalculator />
                </ProtectedRoute>
              } />
            </Routes>
            <Footer />
          </ErrorBoundary>
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
