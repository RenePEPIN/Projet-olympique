import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

/**
 * Composant de la barre de recherche.
 * @returns {JSX.Element} Élément JSX représentant la barre de recherche.
 */
function SearchBox() {
    // État local pour stocker le mot-clé de recherche
    const [keyword, setKeyword] = useState('');

    // Hook useHistory pour la navigation programmée
    let history = useHistory();

    /**
     * Gestionnaire de soumission du formulaire de recherche.
     * @param {Event} e - L'événement de soumission du formulaire.
     */
    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword) {
            // Redirection vers la page de résultats de recherche avec le mot-clé et la page 1
            history.push(`/?keyword=${keyword}&page=1`);
        } else {
            // Redirection vers la page actuelle en cas de mot-clé vide
            history.push(history.location.pathname);
        }
    };

    return (
        // Formulaire de recherche en ligne
        <Form onSubmit={submitHandler} inline>
            {/* Champ de saisie pour le mot-clé */}
            <Form.Control
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                className="mr-sm-2 ml-sm-5"
            ></Form.Control>

            {/* Bouton de soumission du formulaire */}
            <Button type="submit" variant="outline-success" className="p-2">
                Rechercher
            </Button>
        </Form>
    );
}

export default SearchBox;
