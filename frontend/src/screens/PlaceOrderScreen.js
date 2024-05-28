import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';

/**
 * Écran de passage de commande
 * @param {object} history - Historique de navigation
 * @returns {JSX.Element} Élément JSX représentant l'écran de passage de commande
 */
function PlaceOrderScreen({ history }) {
    // Récupération des données de création de commande depuis le store Redux
    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, error, success } = orderCreate;

    const dispatch = useDispatch();

    // Récupération des données du panier depuis le store Redux
    const cart = useSelector((state) => state.cart);

    // Calcul des prix du panier
    cart.itemsPrice = cart.cartItems
        .reduce((acc, item) => acc + item.price * item.qty, 0)
        .toFixed(2);
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);
    cart.taxPrice = Number(0.082 * cart.itemsPrice).toFixed(2);

    cart.totalPrice = (
        Number(cart.itemsPrice) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    // Redirection vers l'écran de paiement si aucune méthode de paiement n'est sélectionnée
    if (!cart.paymentMethod) {
        history.push('/payment');
    }

    // Effet de côté pour rediriger vers l'écran de détail de commande en cas de succès de création de commande
    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, history]);

    // Fonction pour passer la commande
    const placeOrder = () => {
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            })
        );
    };

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        {/* Adresse de livraison */}
                        <ListGroup.Item>
                            <h3>Adresse de livraison</h3>

                            <p>
                                <strong>Adresse: </strong>
                                {cart.shippingAddress.address},{' '}
                                {cart.shippingAddress.city}
                                {'  '}
                                {cart.shippingAddress.postalCode},{'  '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        {/* Mode de paiement */}
                        <ListGroup.Item>
                            <h3>Mode de paiement</h3>
                            <p>
                                <strong>Payer avec: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>

                        {/* Récapitulatif de la commande */}
                        <ListGroup.Item>
                            <h2>
                                {' '}
                                Vérification et validation de votre commande{' '}
                            </h2>
                            {cart.cartItems.length === 0 ? (
                                <Message variant="info">
                                    Votre panier est vide
                                </Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>

                                                <Col>
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} X {item.price}€ =
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

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            {/* Résumé de la commande */}
                            <ListGroup.Item>
                                <h2>récapitulatif de la commande</h2>
                            </ListGroup.Item>

                            {/* Articles */}
                            <ListGroup.Item>
                                <Row>
                                    <Col>Articles:</Col>
                                    <Col>{cart.itemsPrice}€</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Frais de livraison */}
                            <ListGroup.Item>
                                <Row>
                                    <Col>livraison:</Col>
                                    <Col>{cart.shippingPrice}€</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Taxe */}
                            <ListGroup.Item>
                                <Row>
                                    <Col>Taxe:</Col>
                                    <Col>{cart.taxPrice}€</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Montant total */}
                            <ListGroup.Item>
                                <Row>
                                    <Col>MontantTotal:</Col>
                                    <Col>{cart.totalPrice}€</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* Message d'erreur */}
                            <ListGroup.Item>
                                {error && (
                                    <Message variant="danger">{error}</Message>
                                )}
                            </ListGroup.Item>

                            {/* Bouton de commande */}
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                                >
                                    Passez votre commande et payez
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PlaceOrderScreen;
