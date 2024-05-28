import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import { listProducts } from '../actions/productActions';

/**
 * Écran d'accueil affichant les produits disponibles.
 * @param {Object} history - Historique de navigation.
 * @returns {JSX.Element} Composant de l'écran d'accueil.
 */
function HomeScreen({ history }) {
    const dispatch = useDispatch();

    // Récupération de la liste des produits depuis le state Redux
    const productList = useSelector((state) => state.productList);
    const { error, loading, products, page, pages } = productList;

    // Récupération du mot-clé de recherche depuis l'historique de navigation
    let keyword = history.location.search;

    // Chargement de la liste des produits au chargement de l'écran ou lors du changement du mot-clé de recherche
    useEffect(() => {
        dispatch(listProducts(keyword));
    }, [dispatch, keyword]);

    return (
        <div>
            {/* Affichage du carrousel de produits si aucun mot-clé de recherche n'est spécifié */}
            {!keyword && <ProductCarousel />}

            <h1>Billets disponibles</h1>

            {/* Affichage du message de chargement si les produits sont en cours de chargement */}
            {loading ? (
                <Loader />
            ) : // Affichage du message d'erreur s'il y a une erreur lors du chargement des produits
            error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                // Affichage de la liste des produits si aucun problème n'est survenu
                <div>
                    <Row>
                        {/* Itération sur chaque produit pour les afficher */}
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    {/* Affichage de la pagination pour naviguer entre les pages de produits */}
                    <Paginate page={page} pages={pages} keyword={keyword} />
                </div>
            )}
        </div>
    );
}

export default HomeScreen;
