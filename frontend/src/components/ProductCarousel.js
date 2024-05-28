import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';

/**
 * Composant pour le carousel des produits les mieux notés.
 * @returns {JSX.Element} Composant React pour le carousel des produits.
 */
function ProductCarousel() {
    // Dispatch Redux pour envoyer des actions à Redux
    const dispatch = useDispatch();

    // Sélection du state Redux contenant les produits les mieux notés
    const productTopRated = useSelector((state) => state.productTopRated);
    const { error, loading, products } = productTopRated;

    // Effet pour charger la liste des produits les mieux notés
    useEffect(() => {
        dispatch(listTopProducts());
    }, [dispatch]);

    // Affichage du carousel des produits les mieux notés
    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error}</Message>
    ) : (
        <Carousel pause="hover" className="bg-dark">
            {products.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className="carousel-caption">
                            <h4>
                                {product.name} ({product.price}€)
                            </h4>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default ProductCarousel;
