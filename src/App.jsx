import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import Landingpage from './pages/Landingpage';
import Dashboard from './pages/dashboard';
import BudgetCalculator from './pages/BudgetCalculator';
import FireCalculator from './pages/FireCalculator';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BudgetProvider>
          <ErrorBoundary>
            <Header />
            <Routes>
              <Route path="/" element={<Landingpage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/budget-calculator" element={<BudgetCalculator />} />
              <Route path="/fire-calculator" element={<FireCalculator />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </ErrorBoundary>
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
