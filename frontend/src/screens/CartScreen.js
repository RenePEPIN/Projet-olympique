import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Col,
    ListGroup,
    Image,
    Form,
    Button,
    Card,
} from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

/**
 * Écran du panier d'achat.
 * @param {object} match - Les paramètres de l'URL.
 * @param {object} location - L'objet de localisation.
 * @param {object} history - L'historique de navigation.
 * @returns {JSX.Element} Composant du panier d'achat.
 */
function CartScreen({ match, location, history }) {
    // Récupération de l'identifiant du produit et de la quantité depuis l'URL
    const productId = match.params.id;
    const qty = location.search ? Number(location.search.split('=')[1]) : 1;

    // Initialisation du dispatcher Redux
    const dispatch = useDispatch();

    // Récupération du panier depuis le store Redux
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    // Effet déclenché lorsque le composant est monté pour ajouter un produit au panier
    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);

    // Gestionnaire pour supprimer un produit du panier
    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    // Gestionnaire pour passer à l'écran de connexion lors du paiement
    const checkoutHandler = () => {
        history.push('/login?redirect=shipping');
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Votre panier </h1>
                {/* Affichage d'un message si le panier est vide */}
                {cartItems.length === 0 ? (
                    <Message variant="info">
                        Votre panier est vide <Link to="/">Revenir</Link>
                    </Message>
                ) : (
                    // Affichage de la liste des produits dans le panier
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fluid
                                            rounded
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>
                                            {item.name}
                                        </Link>
                                    </Col>
                                    <Col md={2}>{item.price}€</Col>
                                    <Col md={3}>
                                        {/* Sélecteur pour modifier la quantité */}
                                        <Form.Control
                                            as="select"
                                            value={item.qty}
                                            onChange={(e) =>
                                                dispatch(
                                                    addToCart(
                                                        item.product,
                                                        Number(e.target.value)
                                                    )
                                                )
                                            }
                                        >
                                            {[
                                                ...Array(
                                                    item.countInStock
                                                ).keys(),
                                            ].map((x) => (
                                                <option
                                                    key={x + 1}
                                                    value={x + 1}
                                                >
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        {/* Bouton pour supprimer un produit du panier */}
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() =>
                                                removeFromCartHandler(
                                                    item.product
                                                )
                                            }
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>

            {/* Colonne pour le résumé du panier et le bouton de paiement */}
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>
                                Sous-total (
                                {cartItems.reduce(
                                    (acc, item) => acc + item.qty,
                                    0
                                )}
                                )
                            </h2>
                            {/* Calcul du sous-total */}
                            {cartItems
                                .reduce(
                                    (acc, item) => acc + item.qty * item.price,
                                    0
                                )
                                .toFixed(2)}
                            €
                        </ListGroup.Item>
                    </ListGroup>

                    {/* Bouton de paiement */}
                    <ListGroup.Item>
                        <Button
                            type="button"
                            className="btn-block"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Procéder au paiement
                        </Button>
                    </ListGroup.Item>
                </Card>
            </Col>
        </Row>
    );
}

export default CartScreen;
