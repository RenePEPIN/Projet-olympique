// Importation du module axios pour effectuer des requêtes HTTP
import axios from 'axios';

// Importation des constantes pour les actions du panier
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';

/**
 * Ajoute un article au panier.
 * @param {string} id - L'identifiant du produit à ajouter.
 * @param {number} qty - La quantité de produits à ajouter.
 * @returns {Function} Fonction async pour dispatch une action Redux.
 */
export const addToCart = (id, qty) => async (dispatch, getState) => {
    // Effectuer une requête pour obtenir les détails du produit
    const { data } = await axios.get(`/api/products/${id}`);

    // Dispatch d'une action pour ajouter un article au panier avec les détails du produit
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty,
        },
    });

    // Mettre à jour le stockage local avec les éléments actuels du panier
    localStorage.setItem(
        'cartItems',
        JSON.stringify(getState().cart.cartItems)
    );
};

/**
 * Supprime un article du panier.
 * @param {string} id - L'identifiant du produit à supprimer.
 * @returns {Function} Fonction pour dispatch une action Redux.
 */
export const removeFromCart = (id) => (dispatch, getState) => {
    // Dispatch d'une action pour supprimer un article du panier avec l'ID du produit
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    });

    // Mettre à jour le stockage local avec les éléments actuels du panier
    localStorage.setItem(
        'cartItems',
        JSON.stringify(getState().cart.cartItems)
    );
};

/**
 * Enregistre l'adresse de livraison.
 * @param {Object} data - Les données de l'adresse de livraison.
 * @returns {Function} Fonction pour dispatch une action Redux.
 */
export const saveShippingAddress = (data) => (dispatch) => {
    // Dispatch d'une action pour enregistrer l'adresse de livraison avec les données fournies
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    });

    // Mettre à jour le stockage local avec les données de l'adresse de livraison
    localStorage.setItem('shippingAddress', JSON.stringify(data));
};

/**
 * Enregistre la méthode de paiement.
 * @param {string} data - Les données de la méthode de paiement.
 * @returns {Function} Fonction pour dispatch une action Redux.
 */
export const savePaymentMethod = (data) => (dispatch) => {
    // Dispatch d'une action pour enregistrer la méthode de paiement sélectionnée
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    });

    // Mettre à jour le stockage local avec les données de la méthode de paiement
    localStorage.setItem('paymentMethod', JSON.stringify(data));
};
