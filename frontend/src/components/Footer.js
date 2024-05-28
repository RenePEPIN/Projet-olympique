// Import des modules React nécessaires
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Import des composants de Bootstrap pour la mise en page

/**
 * Composant Footer : représente le pied de page de l'application.
 * Ce composant affiche le copyright de la billetterie olympique 2024.
 * @returns {JSX.Element} Élément JSX représentant le pied de page.
 */
function Footer() {
    return (
        // Début du pied de page
        <footer>
            {/* Conteneur pour la mise en page */}
            <Container>
                {/* Ligne pour organiser les éléments */}
                <Row>
                    {/* Colonne avec un contenu centré et un espacement de 3 en y */}
                    <Col className="text-center py-3">
                        {/* Texte de copyright */}
                        Copyright &copy; Billetterie olympique 2024
                    </Col>
                </Row>
            </Container>
        </footer> // Fin du pied de page
    );
}

// Export du composant Footer pour l'utiliser ailleurs dans l'application
export default Footer;
