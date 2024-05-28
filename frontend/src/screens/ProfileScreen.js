import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { listMyOrders } from '../actions/orderActions';
import QRCode from 'react-qr-code';

/**
 * Composant pour afficher et mettre à jour le profil de l'utilisateur.
 * @param {object} history - Historique de navigation React Router.
 * @returns {JSX.Element} Composant de l'écran de profil.
 */
function ProfileScreen({ history }) {
    // États pour les champs du formulaire et autres états nécessaires
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showTicketModal, setShowTicketModal] = useState(false);

    const dispatch = useDispatch();

    // Sélecteurs Redux pour obtenir les informations de l'utilisateur, les commandes de l'utilisateur, etc.
    const userDetails = useSelector((state) => state.userDetails);
    const { error, loading, user } = userDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success } = userUpdateProfile;

    const orderListMy = useSelector((state) => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;
    const [paidDate, setPaidDate] = useState('');

    // Effets secondaires pour charger les détails de l'utilisateur et les commandes lors du chargement du composant
    useEffect(() => {
        // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
        if (!userInfo) {
            history.push('/login');
        } else {
            // Rechargement des détails de l'utilisateur et des commandes si nécessaire
            if (!user || !user.name || success || userInfo._id !== user._id) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails('profile'));
                dispatch(listMyOrders());
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, history, userInfo, user, success]);

    // Effet secondaire pour déterminer la date de paiement de la dernière commande payée
    useEffect(() => {
        if (orders && orders.length > 0) {
            const paidOrder = orders.find(
                (order) => order.isPaid && order.paidAt
            );
            if (paidOrder) {
                setPaidDate(paidOrder.paidAt.substring(0, 10));
            }
        }
    }, [orders, setPaidDate]);

    // Gestionnaire pour soumettre le formulaire de mise à jour du profil de l'utilisateur
    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Les mots de passe ne correspondent pas');
        } else {
            // Dispatch de l'action pour mettre à jour le profil de l'utilisateur
            dispatch(
                updateUserProfile({
                    id: user._id,
                    name: name,
                    email: email,
                    password: password,
                })
            );
            setMessage('');
        }
    };

    // Gestionnaire pour afficher la modal des billets
    const handlePrintTicket = () => {
        setShowTicketModal(true);
    };

    // Gestionnaire pour fermer la modal des billets
    const handleCloseTicketModal = () => {
        setShowTicketModal(false);
    };

    return (
        <Row>
            {/* Colonne pour afficher et mettre à jour le profil */}
            <Col md={3}>
                <h2>Profil utilisateur</h2>
                {/* Affichage des messages d'erreur et de chargement */}
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}
                {/* Formulaire pour mettre à jour le profil */}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            required
                            type="name"
                            placeholder="Entrez votre nom"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="Entrer votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Entrer votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="passwordConfirm">
                        <Form.Label>Confirmer mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirmer mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary">
                        Mettre à jour
                    </Button>
                </Form>
            </Col>

            {/* Colonne pour afficher les commandes de l'utilisateur */}
            <Col md={9}>
                <h2>Mes commandes</h2>
                {/* Affichage des messages d'erreur et de chargement */}
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant="danger">{errorOrders}</Message>
                ) : (
                    <Table striped responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payé</th>
                                <th>Livraison</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapping des commandes de l'utilisateur */}
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>
                                            {order.createdAt.substring(0, 10)}
                                        </td>
                                        <td>{order.totalPrice}€</td>
                                        <td>
                                            {order.isPaid ? (
                                                order.paidAt?.substring(
                                                    0,
                                                    10
                                                ) ??
                                                'Date de paiement non disponible'
                                            ) : (
                                                <i
                                                    className="fas fa-times"
                                                    style={{ color: 'red' }}
                                                ></i>
                                            )}
                                        </td>
                                        <td>
                                            {/* Lien pour afficher les détails de la commande */}
                                            <LinkContainer
                                                to={`/order/${order._id}`}
                                            >
                                                <Button className="btn-sm">
                                                    Détails
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // Message si aucune commande trouvée
                                <tr>
                                    <td colSpan={5}>
                                        Aucune commande trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Col>

            {/* Bouton pour imprimer les billets */}
            <Col md={3}>
                <Button
                    onClick={handlePrintTicket}
                    variant="primary"
                    className="mt-4"
                >
                    Imprimer les billets
                </Button>
            </Col>

            {/* Modal pour afficher les billets */}
            <Modal show={showTicketModal} onHide={handleCloseTicketModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Vos billets</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Contenu des billets avec les codes QR */}
                    {orders && orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id}>
                                <h4>Billet ID: {order._id}</h4>
                                <QRCode value={`Billet ID: ${order._id}`} />
                            </div>
                        ))
                    ) : (
                        <p>Aucun billet à afficher</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleCloseTicketModal}
                    >
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
}

export default ProfileScreen;
