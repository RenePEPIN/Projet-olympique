// Import des modules React nécessaires
import React from 'react';
import ReactDOM from 'react-dom';

// Import du composant Provider pour Redux
import { Provider } from 'react-redux';

// Import du store Redux
import store from './store';

// Import des styles CSS
import './index.css';
import './bootstrap.min.css';

// Import du composant principal de l'application
import App from './App';

// Import de la fonction pour mesurer les performances de l'application
import reportWebVitals from './reportWebVitals';

/**
 * Rendu de l'application dans l'élément HTML avec l'ID "root".
 * Le composant Provider enveloppe l'application pour donner accès au store Redux.
 * @function
 * @param {JSX.Element} (
 * @returns {JSX.Element} Renvoie l'application enveloppée dans le Provider.
 */
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// Si vous souhaitez mesurer les performances de votre application, passez une fonction
// pour enregistrer les résultats (par exemple : reportWebVitals(console.log))
// ou envoyez-les à un point de terminaison d'analyse.
// Apprenez-en plus : https://bit.ly/CRA-vitals
reportWebVitals();
