import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';

/**
 * Écran de création de compte utilisateur.
 * @param {object} location - L'objet location fourni par React Router.
 * @param {object} history - L'objet history fourni par React Router.
 * @returns {JSX.Element} Élément JSX représentant l'écran d'inscription.
 */
function RegisterScreen({ location, history }) {
    // États locaux pour gérer les champs du formulaire et les messages d'erreur
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    // Dispatch Redux pour exécuter l'action d'inscription
    const dispatch = useDispatch();

    // Récupération de la redirection depuis l'URL
    const redirect = location.search ? location.search.split('=')[1] : '/';

    // Sélecteur Redux pour obtenir l'état de l'inscription de l'utilisateur
    const userRegister = useSelector((state) => state.userRegister);
    const { error, loading, userInfo } = userRegister;

    // Redirection une fois l'inscription réussie
    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, userInfo, redirect]);

    // Gestionnaire de soumission du formulaire
    const submitHandler = (e) => {
        e.preventDefault();

        // Vérification que les mots de passe correspondent
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            // Dispatch de l'action d'inscription avec les données du formulaire
            dispatch(register(name, email, password));
        }
    };

    return (
        <FormContainer>
            <h1>Créer un compte</h1>
            {/* Affichage du message d'erreur */}
            {message && <Message variant="danger">{message}</Message>}
            {/* Affichage de l'erreur Redux */}
            {error && <Message variant="danger">{error}</Message>}
            {/* Affichage du spinner de chargement */}
            {loading && <Loader />}
            {/* Formulaire d'inscription */}
            <Form onSubmit={submitHandler}>
                {/* Champ nom */}
                <Form.Group controlId="name">
                    <Form.Label>Votre Nom</Form.Label>
                    <Form.Control
                        required
                        type="name"
                        placeholder="Prénom et nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                {/* Champ email */}
                <Form.Group controlId="email">
                    <Form.Label>Email </Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="Entrer votre Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                {/* Champ mot de passe */}
                <Form.Group controlId="password">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                {/* Champ confirmation du mot de passe */}
                <Form.Group controlId="passwordConfirm">
                    <Form.Label>Confirmation du mot de passe</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Confirmez votre mot de passe "
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                {/* Bouton d'inscription */}
                <Button type="submit" variant="primary">
                    Enregistrer
                </Button>
            </Form>
            {/* Lien vers la page de connexion */}
            <Row className="py-3">
                <Col>
                    Vous avez un compte?{' '}
                    <Link
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}
                    >
                        Connectez-vous
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default RegisterScreen;
