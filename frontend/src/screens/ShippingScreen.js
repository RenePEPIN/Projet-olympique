import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';

/**
 * Écran de la page de livraison.
 * Permet à l'utilisateur de saisir les informations de livraison.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {Object} props.history - L'objet de l'historique de navigation.
 * @returns {JSX.Element} Élément React représentant l'écran de livraison.
 */
function ShippingScreen({ history }) {
    // Sélection des données d'adresse de livraison depuis le store Redux
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    // Initialisation du dispatch Redux
    const dispatch = useDispatch();

    // Définition des états locaux pour les champs du formulaire
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(
        shippingAddress.postalCode || ''
    );
    const [country, setCountry] = useState(shippingAddress.country || '');

    /**
     * Fonction de gestionnaire de soumission du formulaire.
     * Enregistre l'adresse de livraison dans le store Redux et redirige vers l'écran de paiement.
     * @param {Object} e - L'événement de soumission du formulaire.
     */
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        history.push('/payment');
    };

    return (
        <FormContainer>
            {/* Composant de progression de la commande */}
            <CheckoutSteps step1 step2 />
            <h1>Adresse de livraison</h1>
            <Form onSubmit={submitHandler}>
                {/* Champ d'adresse */}
                <Form.Group controlId="address">
                    <Form.Label>Addresse</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Form.Group>

                {/* Champ de ville */}
                <Form.Group controlId="city">
                    <Form.Label>Ville</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </Form.Group>

                {/* Champ de code postal */}
                <Form.Group controlId="postalCode">
                    <Form.Label>Code Postale</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                </Form.Group>

                {/* Champ de pays */}
                <Form.Group controlId="country">
                    <Form.Label>Pays</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </Form.Group>

                {/* Bouton de soumission du formulaire */}
                <Button type="submit" variant="primary">
                    Continuer
                </Button>
            </Form>
        </FormContainer>
    );
}

export default ShippingScreen;
