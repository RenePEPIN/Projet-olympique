import React from 'react';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import { Link } from 'react-router-dom';

/**
 * Composant pour afficher un produit dans une carte.
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.product - Les informations du produit à afficher.
 * @returns {JSX.Element} Composant de produit.
 */
function Product({ product }) {
    return (
        // Carte Bootstrap pour afficher le produit
        <Card className="my-3 p-3 rounded">
            {/* Lien vers la page de détails du produit */}
            <Link to={`/product/${product._id}`}>
                {/* Image du produit */}
                <Card.Img src={product.image} />
            </Link>

            {/* Contenu de la carte */}
            <Card.Body className="d-flex flex-column justify-content-between">
                {/* Lien vers la page de détails du produit */}
                <Link to={`/product/${product._id}`}>
                    {/* Titre du produit */}
                    <Card.Title as="div">
                        {/* Nom du produit */}
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                {/* Texte de la carte */}
                <Card.Text as="div">
                    <div className="my-3">
                        {/* Composant de notation du produit */}
                        <Rating
                            value={product.rating}
                            text={`${product.numReviews} reviews `}
                            color={'#f8e825'}
                        />
                    </div>
                </Card.Text>

                {/* Prix du produit */}
                <Card.Text as="h3">{product.price}€</Card.Text>
            </Card.Body>
        </Card>
    );
}

export default Product;
