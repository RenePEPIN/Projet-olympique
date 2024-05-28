import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';

/**
 * Écran de connexion.
 * @param {object} location - L'emplacement actuel.
 * @param {object} history - L'historique de navigation.
 * @returns {JSX.Element} Écran de connexion.
 */
function LoginScreen({ location, history }) {
    // State pour l'email et le mot de passe
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Dispatcher pour déclencher l'action de connexion
    const dispatch = useDispatch();

    // Récupération de la redirection depuis l'URL (si présente)
    const redirect = location.search ? location.search.split('=')[1] : '/';

    // Sélecteur pour récupérer l'état du login de l'utilisateur
    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    // Redirection vers la page de destination une fois l'utilisateur connecté
    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, userInfo, redirect]);

    // Soumission du formulaire de connexion
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    // Affichage du formulaire de connexion
    return (
        <FormContainer>
            <h1>Connectez-vous</h1>
            {/* Affichage du message d'erreur en cas d'erreur */}
            {error && <Message variant="danger">{error}</Message>}
            {/* Affichage du spinner de chargement en cas de chargement */}
            {loading && <Loader />}
            {/* Formulaire de connexion */}
            <Form onSubmit={submitHandler}>
                {/* Champ de saisie pour l'email */}
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {/* Champ de saisie pour le mot de passe */}
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {/* Bouton de soumission du formulaire */}
                <Button type="submit" variant="primary">
                    Se connecter
                </Button>
            </Form>

            {/* Lien vers la page d'enregistrement */}
            <Row className="py-3">
                <Col>
                    Nouveau client ?{' '}
                    <Link
                        to={
                            redirect
                                ? `/register?redirect=${redirect}`
                                : '/register'
                        }
                    >
                        Enregistrez-vous
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default LoginScreen;
