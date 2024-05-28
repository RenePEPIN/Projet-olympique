import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

/**
 * Écran de paiement où l'utilisateur sélectionne le mode de paiement.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {Object} props.history - L'objet d'historique de navigation.
 * @returns {JSX.Element} Composant d'écran de paiement.
 */
function PaymentScreen({ history }) {
    // Récupération des informations de panier et du mode de paiement depuis le state Redux
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const dispatch = useDispatch();

    // État local pour stocker le mode de paiement sélectionné par l'utilisateur
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    // Vérification de l'adresse de livraison ; si elle n'est pas définie, rediriger vers l'écran de livraison
    if (!shippingAddress.address) {
        history.push('/shipping');
    }

    // Fonction pour gérer la soumission du formulaire de sélection du mode de paiement
    const submitHandler = (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du formulaire

        // Dispatch de l'action pour enregistrer le mode de paiement sélectionné
        dispatch(savePaymentMethod(paymentMethod));

        // Redirection vers l'écran de passation de commande
        history.push('/placeorder');
    };

    // Rendu du composant d'écran de paiement
    return (
        <FormContainer>
            {/* Affichage des étapes de paiement dans la barre de progression */}
            <CheckoutSteps step1 step2 step3 />

            {/* Formulaire de sélection du mode de paiement */}
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as="legend">Mode de paiement</Form.Label>
                    <Col>
                        {/* Sélection du mode de paiement via les boutons radio */}
                        <Form.Check
                            type="radio"
                            label="PayPal ou Carte de crédit"
                            id="paypal"
                            name="paymentMethod"
                            checked // PayPal sélectionné par défaut
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>

                {/* Bouton de soumission du formulaire */}
                <Button type="submit" variant="primary">
                    Continuer
                </Button>
            </Form>
        </FormContainer>
    );
}

export default PaymentScreen;
