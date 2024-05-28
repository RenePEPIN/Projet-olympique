import React from 'react'; // Import de React depuis la bibliothèque React
import { Container, Row, Col } from 'react-bootstrap'; // Import des composants Container, Row et Col depuis la bibliothèque react-bootstrap

/**
 * Composant fonctionnel FormContainer.
 * Ce composant enveloppe son contenu dans un Container Bootstrap et le centre horizontalement.
 * @param {object} props - Les propriétés passées au composant.
 * @param {React.ReactNode} props.children - Les éléments enfants du composant.
 * @returns {React.ReactNode} Composant FormContainer.
 */
function FormContainer({ children }) {
    return (
        <Container>
            {' '}
            {/* Conteneur Bootstrap */}
            <Row className="justify-content-md-center">
                {' '}
                {/* Ligne Bootstrap avec contenu centré horizontalement */}
                <Col xs={12} md={6}>
                    {' '}
                    {/* Colonne Bootstrap pour les tailles d'écran xs et md */}
                    {children}{' '}
                    {/* Affichage des éléments enfants du composant */}
                </Col>
            </Row>
        </Container>
    );
}

export default FormContainer; // Export du composant FormContainer
