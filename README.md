Wat hoort in elke map?
src/assets/
Bevat:

Afbeeldingen: Logo’s, iconen, achtergrondbeelden.
Fonts: Specifieke lettertypen indien nodig.
src/components/
Hier komen herbruikbare componenten zoals:

Header.jsx: Navigatiebalk of koptekst.
TransactionForm.jsx: Formulier om inkomsten/uitgaven toe te voegen.
TransactionList.jsx: Weergave van alle transacties.
Chart.jsx: Grafiekcomponent met Chart.js of react-chartjs-2.
src/context/
Bevat bestanden voor state management:

BudgetContext.jsx: Context en reducer voor transacties.
src/hooks/
Opslag voor aangepaste hooks, bijvoorbeeld:

useLocalStorage.js: Om gegevens op te slaan in localStorage.
useCalculateFire.js: Voor FIRE-berekeningen.
src/pages/
Hier komen pagina-componenten, bijvoorbeeld:

Dashboard.jsx: Hoofdpagina voor transactiebeheer.
FireCalculator.jsx: Voor de FIRE-functionaliteit.
SavingsTips.jsx: Bespaarsuggesties.
src/styles/
Bevat:

Global.css: Globale stijlen.
Component-specifieke CSS: Bijvoorbeeld TransactionForm.css.
src/utils/
Helper-functies zoals:

calculateSavings.js: Voor het berekenen van hoeveel een gebruiker kan besparen.
formatCurrency.js: Om bedragen op te maken (bijv. €1.234,56).


Abonnement Checker: App die gebruikers helpt vergeten abonnementen te annuleren.