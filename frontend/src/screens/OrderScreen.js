import React, { useState, useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from 'react-paypal-button-v2';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
    getOrderDetails,
    payOrder,
    deliverOrder,
} from '../actions/orderActions';
import {
    ORDER_PAY_RESET,
    ORDER_DELIVER_RESET,
} from '../constants/orderConstants';

/**
 * Écran pour afficher les détails d'une commande.
 * @param {object} match - Les informations de l'URL.
 * @param {object} history - L'historique de navigation.
 * @returns {JSX.Element} Élément JSX représentant l'écran des détails de la commande.
 */
function OrderScreen({ match, history }) {
    // Déclaration des variables d'état et de dispatch
    const orderId = match.params.id;
    const dispatch = useDispatch();

    const [sdkReady, setSdkReady] = useState(false);

    // Sélection des informations de la commande à partir du store Redux
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, error, loading } = orderDetails;

    // Sélection des informations sur le paiement de la commande
    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    // Sélection des informations sur la livraison de la commande
    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    // Sélection des informations de connexion de l'utilisateur
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Calcul du prix total des articles dans la commande
    if (!loading && !error) {
        order.itemsPrice = order.orderItems
            .reduce((acc, item) => acc + item.price * item.qty, 0)
            .toFixed(2);
    }

    // Ajout du script PayPal
    const addPayPalScript = () => {
        // Création de l'élément script pour charger le script PayPal
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src =
            'https://www.paypal.com/sdk/js?client-id=AeDXja18CkwFUkL-HQPySbzZsiTrN52cG13mf9Yz7KiV2vNnGfTDP0wDEN9sGlhZHrbb_USawcJzVDgn';
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        // Ajout du script au corps du document
        document.body.appendChild(script);
    };

    // Effet pour charger les détails de la commande et vérifier le paiement PayPal
    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        }

        // Vérification des conditions pour charger les détails de la commande
        if (
            !order ||
            successPay ||
            order._id !== Number(orderId) ||
            successDeliver
        ) {
            // Réinitialisation des états Redux pour le paiement et la livraison
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });

            // Chargement des détails de la commande
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            // Vérification si le paiement n'a pas encore été effectué
            if (!window.paypal) {
                // Ajout du script PayPal si celui-ci n'est pas chargé
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [
        dispatch,
        order,
        orderId,
        successPay,
        successDeliver,
        userInfo,
        history,
    ]);

    // Gestionnaire pour le succès du paiement PayPal
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    };

    // Gestionnaire pour la livraison de la commande
    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    };

    // Rendu de l'écran en fonction de l'état de chargement et des erreurs
    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error}</Message>
    ) : (
        <div>
            {/* Titre de la page */}
            <h1>Commande: {order.Id}</h1>

            {/* Contenu de la page */}
            <Row>
                {/* Colonne principale */}
                <Col md={8}>
                    {/* Informations sur l'adresse de livraison */}
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Addresse de la commande</h2>
                            {/* Détails de l'adresse de livraison */}
                            <p>
                                <strong>Nom: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>
                                    {order.user.email}
                                </a>
                            </p>
                            <p>
                                <strong>Adresse: </strong>
                                {order.shippingAddress.address},{' '}
                                {order.shippingAddress.city}
                                {'  '}
                                {order.shippingAddress.postalCode},{'  '}
                                {order.shippingAddress.country}
                            </p>
                            {/* Statut de livraison */}
                            {order.isDelivered ? (
                                <Message variant="success">
                                    En cours de validation {order.deliveredAt}
                                </Message>
                            ) : (
                                <Message variant="warning">
                                    En Attente de validation
                                </Message>
                            )}
                        </ListGroup.Item>

                        {/* Informations sur le mode de paiement */}
                        <ListGroup.Item>
                            <h2>Mode de paiement</h2>
                            {/* Détails du mode de paiement */}
                            <p>
                                <strong>Payer avec: </strong>
                                {order.paymentMethod}
                            </p>
                            {/* Statut du paiement */}
                            {order.isPaid ? (
                                <Message variant="success">
                                    Payé le{' '}
                                    {new Date(
                                        order.paidAt
                                    ).toLocaleDateString()}{' '}
                                    à{' '}
                                    {new Date(
                                        order.paidAt
                                    ).toLocaleTimeString()}
                                </Message>
                            ) : (
                                <Message variant="warning">
                                    Paiment en cours
                                </Message>
                            )}
                        </ListGroup.Item>

                        {/* Liste des articles commandés */}
                        <ListGroup.Item>
                            <h2>Vos articles</h2>
                            {/* Vérification si la commande est vide */}
                            {order.orderItems.length === 0 ? (
                                <Message variant="info">Commande vide</Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {/* Affichage de chaque article */}
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            {/* Détails de l'article */}
                                            <Row>
                                                <Col md={1}>
                                                    {/* Image de l'article */}
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>

                                                <Col>
                                                    {/* Nom de l'article */}
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </Col>

                                                <Col md={4}>
                                                    {/* Quantité et prix de l'article */}
                                                    {item.qty} X {item.price}€ ={' '}
                                                    {(
                                                        item.qty * item.price
                                                    ).toFixed(2)}
                                                    €
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                {/* Colonne latérale */}
                <Col md={4}>
                    {/* Résumé de la commande */}
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>récapitulatif de la commande</h2>
                            </ListGroup.Item>

                            {/* Sous-total */}
                            <ListGroup.Item>
                                <Row>
                                    <Col>Articles:</Col>
                                    <Col>{order.itemsPrice}€</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Frais de livraison */}
                            <ListGroup.Item>
                                <Row>
                                    <Col>Livraison:</Col>
                                    <Col>{order.shippingPrice}€</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Taxe */}
                            <ListGroup.Item>
                                <Row>
                                    <Col>Taxe:</Col>
                                    <Col>{order.taxPrice}€</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Total */}
                            <ListGroup.Item>
                                <Row>
                                    <Col>Sous-Total:</Col>
                                    <Col>{order.totalPrice}€</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Bouton PayPal */}
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}

                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                        {/* Chargement de la livraison */}
                        {loadingDeliver && <Loader />}
                        {/* Bouton de livraison (pour les administrateurs) */}
                        {userInfo &&
                            userInfo.isAdmin &&
                            order.isPaid &&
                            !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button
                                        type="button"
                                        className="btn btn-block"
                                        onClick={deliverHandler}
                                    >
                                        Marquer comme livré
                                    </Button>
                                </ListGroup.Item>
                            )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderScreen;
