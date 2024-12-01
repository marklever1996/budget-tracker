import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import Landingpage from './pages/Landingpage';
import Dashboard from './pages/dashboard';
import BudgetCalculator from './pages/BudgetCalculator';
import Header from './components/Header';
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/budget-calculator" element={<BudgetCalculator />} />
            </Routes>
          </ErrorBoundary>
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
