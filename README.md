*** FRONTEND TODO***
- Register pagina (KAN LATER)
- Reset password pagina (KAN LATER)
- Budgetoverzicht pagina
- FIRE Overzicht pagina

*** BACKEND ***
- Firebase database voor opslag van gebruikersgegevens (KAN LATER)
- Firebase security regels voor database (KAN LATER)

*** API's ***
- DEGIRO API voor bankconnectie (TODO) -->DEGIRO biedt geen API aan, alternatief is SAXO Bank API
- Salt Edge API voor bankconnectie (In afwachting van API)
- Kadaster API voor WOZ waarde (In afwachting van API)
- RDW API voor voertuigwaarde (Werkt; maar is niet 100% nauwkeurig)
- Coinmerce API voor crypto waarde (TODO)

*** NEXT ***

    *** Vermogensoverzicht (= Home pagina) ***
    - Spaargeld; dit wordt verkregen door Salt Edge API
    - Vastgoed; WOZ waarde wordt verkregen door de API van Kadaster
    - Voertuigen; waarde wordt verkregen door de API van RDW (werkt; maar is niet 100% nauwkeurig)
    - Crypto; waarde wordt verkregen door de API van Coinmerce
    - Overig; dit moet handmatig worden ingevoerd

*** IDEEEN ***
- Deelbaar dashboard voor partners (KAN LATER)
- AI voor categoriseren van transacties (KAN LATER)
- AI voor suggesties voor financiële doelen (KAN LATER)
- AI feedback op transacties (KAN LATER)



--------------------------------STRUCTURE--------------------------------
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   │
│   ├── common/
│   │   ├── CategoryCard/
│   │   │   ├── index.jsx
│   │   │   └── styles.css
│   │   └── DeGiroBanner/
│   │       ├── index.jsx
│   │       └── styles.css
│   │
│   └── categories/
│       ├── Investments/
│       │   ├── index.jsx
│       │   ├── styles.css
│       │   └── components/
│       │       └── DeGiroLink.jsx
│       │
│       ├── Vehicles/
│       │   ├── index.jsx
│       │   ├── styles.css
│       │   ├── hooks/
│       │   │   └── useVehicles.js
│       │   └── components/
│       │       └── VehicleModal.jsx
│       │
│       ├── RealEstate/
│       │   ├── index.jsx
│       │   └── styles.css
│       │
│       ├── Savings/
│       │   ├── index.jsx
│       │   └── styles.css
│       │
│       └── Crypto/
│           ├── index.jsx
│           └── styles.css
│
├── pages/
│   └── Investments/
│       ├── index.jsx
│       └── styles.css
│
├── hooks/
│   └── usePortfolio.js
│
├── services/
│   ├── vehicleService.js
│   └── wozService.js
│
└── context/
    └── AuthContext.jsx