import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landingpage from './pages/Landingpage';
import Budget from './pages/Budget';
import BudgetCalculator from './pages/BudgetCalculator';
import FireDashboard from './pages/FireDashboard';
import FireCalculator from './pages/FireCalculator';
import Investments from './pages/Investments';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PlaidCallback from './pages/PlaidCallback';

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
              <Route path="/fire" element={
                <ProtectedRoute>
                  <FireDashboard />
                </ProtectedRoute>
              } />
              <Route path="/budget-calculator" element={
                <ProtectedRoute>
                  <BudgetCalculator />
                </ProtectedRoute>
              } />
              <Route path="/fire-calculator" element={
                <ProtectedRoute>
                  <FireCalculator />
                </ProtectedRoute>
              } />
              
              {/* Callback route voor Plaid */}
              <Route path="/callback" element={<PlaidCallback />} />
            </Routes>
            <Footer />
          </ErrorBoundary>
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
