import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Row,
    Col,
    Image,
    ListGroup,
    Button,
    Card,
    Form,
} from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProductDetails } from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

/**
 * Composant pour afficher les détails d'un produit.
 * @param {object} match - Les paramètres d'URL fournis par React Router.
 * @param {object} history - L'historique de navigation fourni par React Router.
 * @returns {JSX.Element} Composant React pour afficher les détails d'un produit.
 */
function ProductScreen({ match, history }) {
    // State pour la quantité sélectionnée
    const [qty, setQty] = useState(1);

    // Dispatch pour envoyer des actions Redux
    const dispatch = useDispatch();

    // Sélection du state Redux pour les détails du produit
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    // Sélection du state Redux pour la création de commentaire de produit
    const productReviewCreate = useSelector(
        (state) => state.productReviewCreate
    );
    const { success: successProductReview } = productReviewCreate;

    // Effet pour charger les détails du produit et réinitialiser la création de commentaire
    useEffect(() => {
        if (successProductReview) {
            // Réinitialiser la notation et le commentaire après la soumission
            setQty(0);
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }

        // Charger les détails du produit
        dispatch(listProductDetails(match.params.id));
    }, [dispatch, match, successProductReview]);

    // Gestionnaire d'ajout au panier
    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`);
    };

    return (
        <div>
            {/* Bouton pour revenir en arrière */}
            <Link to="/" className="btn btn-light my-3">
                Revenir
            </Link>
            {/* Affichage du chargement */}
            {loading ? (
                <Loader />
            ) : error ? ( // Affichage de l'erreur
                <Message variant="danger">{error}</Message>
            ) : (
                // Affichage des détails du produit
                <div>
                    <Row>
                        <Col md={6}>
                            {/* Image du produit */}
                            <Image
                                src={product.image}
                                alt={product.name}
                                fluid
                            />
                        </Col>

                        <Col md={3}>
                            {/* Détails du produit */}
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Prix: {product.price}€
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            {/* Carte avec le prix et les options d'achat */}
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Prix:</Col>
                                            <Col>
                                                <strong>
                                                    {product.price}€
                                                </strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                {product.countInStock > 0
                                                    ? 'En stock'
                                                    : 'Rupture de Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {/* Sélection de la quantité */}
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qté</Col>
                                                <Col xs="auto" className="my-1">
                                                    <Form.Control
                                                        as="select"
                                                        value={qty}
                                                        onChange={(e) =>
                                                            setQty(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        {[
                                                            ...Array(
                                                                product.countInStock
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
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    {/* Bouton d'ajout au panier */}
                                    <ListGroup.Item>
                                        <Button
                                            onClick={addToCartHandler}
                                            className="btn-block"
                                            disabled={
                                                product.countInStock === 0
                                            }
                                            type="button"
                                        >
                                            Ajouter au panier
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
}

export default ProductScreen;
