import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Dummy user data voor testing
  const [user, setUser] = useState({
    saldo: 1500,
    inkomsten: 2500,
    uitgaven: 1000,
    budget: 2000,
    spaardoelItem: "Nieuwe Auto",
    spaardoelBedrag: 5000,
    spaardoelBedragTotaal: 15000,
    recentUitgaven: [
      { id: 1, datum: "2024-01-15", naam: "Boodschappen", bedrag: -75.50 },
      { id: 2, datum: "2024-01-14", naam: "Salaris", bedrag: 2500 },
      { id: 3, datum: "2024-01-13", naam: "Benzine", bedrag: -60.00 },
    ],
    categories: [
        {
            name: 'Huisvesting',
            current: 800,
            budget: 1000,
        },
        {
            name: 'Boodschappen',
            current: 350,
            budget: 400,
        },
        {
            name: 'Transport',
            current: 150,
            budget: 200,
        },
        {
            name: 'Entertainment',
            current: 120,
            budget: 150,
        }
    ]
  });

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 