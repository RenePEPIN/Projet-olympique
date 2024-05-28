import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * Composant Loader.
 * Affiche un spinner de chargement pendant le chargement des données.
 * @returns {JSX.Element} Spinner de chargement.
 */
function Loader() {
    return (
        // Spinner Bootstrap pour afficher un indicateur de chargement
        <Spinner
            animation="border" // Animation du spinner
            role="status" // Rôle du spinner dans l'accessibilité
            style={{
                height: '100px', // Hauteur du spinner
                width: '100px', // Largeur du spinner
                margin: 'auto', // Centrage horizontal
                display: 'block', // Affichage en bloc
            }}
        >
            {/* Message d'accessibilité pour les lecteurs d'écran */}
            <span className="sr-only">Loading...</span>
        </Spinner>
    );
}

export default Loader;
