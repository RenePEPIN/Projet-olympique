import React from 'react';
import { Alert } from 'react-bootstrap';

/**
 * Composant pour afficher un message d'alerte.
 * @param {string} variant - Le type de message (success, danger, warning, info).
 * @param {string} children - Le contenu du message.
 * @returns {JSX.Element} Composant d'alerte.
 */
function Message({ variant, children }) {
    return (
        // Composant d'alerte de Bootstrap
        <Alert variant={variant}>
            {/* Contenu du message */}
            {children}
        </Alert>
    );
}

// Export du composant Message
export default Message;
