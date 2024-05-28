import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Composant CheckoutSteps
 * Affiche les étapes du processus de commande avec des liens vers chaque étape.
 * @param {object} props - Les étapes du processus de commande (step1, step2, step3, step4).
 * @returns {JSX.Element} Composant CheckoutSteps.
 */
function CheckoutSteps({ step1, step2, step3, step4 }) {
    return (
        // Barre de navigation pour afficher les étapes de la commande
        <Nav className="justify-content-center flex-nowrap mb-4">
            {/* Étape 1: Connexion */}
            <Nav.Item>
                {/* Vérifie si l'étape 1 est activée */}
                {step1 ? (
                    // Lien vers la page de connexion si l'étape 1 est activée
                    <LinkContainer to="/login">
                        <Nav.Link>Connexion</Nav.Link>
                    </LinkContainer>
                ) : (
                    // Sinon, affiche un lien désactivé
                    <Nav.Link disabled>Connexion</Nav.Link>
                )}
            </Nav.Item>

            {/* Étape 2: Adresse */}
            <Nav.Item>
                {/* Vérifie si l'étape 2 est activée */}
                {step2 ? (
                    // Lien vers la page d'adresse si l'étape 2 est activée
                    <LinkContainer to="/shipping">
                        <Nav.Link>Adresse</Nav.Link>
                    </LinkContainer>
                ) : (
                    // Sinon, affiche un lien désactivé
                    <Nav.Link disabled>Adresse</Nav.Link>
                )}
            </Nav.Item>

            {/* Étape 3: Paiement */}
            <Nav.Item>
                {/* Vérifie si l'étape 3 est activée */}
                {step3 ? (
                    // Lien vers la page de paiement si l'étape 3 est activée
                    <LinkContainer to="/payment">
                        <Nav.Link>Paiement</Nav.Link>
                    </LinkContainer>
                ) : (
                    // Sinon, affiche un lien désactivé
                    <Nav.Link disabled>Paiement</Nav.Link>
                )}
            </Nav.Item>

            {/* Étape 4: Commande */}
            <Nav.Item>
                {/* Vérifie si l'étape 4 est activée */}
                {step4 ? (
                    // Lien vers la page de commande si l'étape 4 est activée
                    <LinkContainer to="/placeorder">
                        <Nav.Link>Commande</Nav.Link>
                    </LinkContainer>
                ) : (
                    // Sinon, affiche un lien désactivé
                    <Nav.Link disabled>Commande</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    );
}

export default CheckoutSteps;
