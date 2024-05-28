import axios from 'axios';

// Importation des constantes pour les actions des commandes
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
} from '../constants/orderConstants';

// Importation de la constante pour l'action de vider le panier
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';

/**
 * Crée une nouvelle commande.
 * @param {Object} order - Les détails de la commande à créer.
 * @returns {Function} Fonction async pour dispatch une action Redux.
 */
export const createOrder = (order) => async (dispatch, getState) => {
    try {
        // Dispatch de l'action indiquant que la création de la commande est en cours
        dispatch({
            type: ORDER_CREATE_REQUEST,
        });

        // Récupération des informations de connexion de l'utilisateur depuis l'état Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration de la requête HTTP avec les en-têtes appropriés (type de contenu et authentification)
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Envoi de la requête POST pour créer la commande avec les détails fournis
        const { data } = await axios.post(`/api/orders/add/`, order, config);

        // Dispatch de l'action indiquant que la création de la commande a réussi avec les détails de la nouvelle commande
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        });

        // Dispatch de l'action pour vider le panier après la création de la commande
        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data,
        });

        // Suppression des articles du panier du stockage local
        localStorage.removeItem('cartItems');
    } catch (error) {
        // En cas d'erreur lors de la création de la commande, dispatch de l'action correspondante avec les détails de l'erreur
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Récupère les détails d'une commande.
 * @param {string} id - L'identifiant de la commande à récupérer.
 * @returns {Function} Fonction async pour dispatch une action Redux.
 */
export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        // Dispatch de l'action indiquant que la récupération des détails de la commande est en cours
        dispatch({
            type: ORDER_DETAILS_REQUEST,
        });

        // Récupération des informations de connexion de l'utilisateur depuis l'état Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration de la requête HTTP avec les en-têtes appropriés (type de contenu et authentification)
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Envoi de la requête GET pour récupérer les détails de la commande avec l'identifiant fourni
        const { data } = await axios.get(`/api/orders/${id}/`, config);

        // Dispatch de l'action indiquant que la récupération des détails de la commande a réussi avec les détails récupérés
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur lors de la récupération des détails de la commande, dispatch de l'action correspondante avec les détails de l'erreur
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Met à jour le statut de paiement d'une commande.
 * @param {string} id - L'identifiant de la commande à mettre à jour.
 * @param {Object} paymentResult - Les détails du paiement.
 * @returns {Function} Fonction async pour dispatch une action Redux.
 */
export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
    try {
        // Dispatch de l'action indiquant que la mise à jour du paiement de la commande est en cours
        dispatch({
            type: ORDER_PAY_REQUEST,
        });

        // Récupération des informations de connexion de l'utilisateur depuis l'état Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration de la requête HTTP avec les en-têtes appropriés (type de contenu et authentification)
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Envoi de la requête PUT pour mettre à jour le paiement de la commande avec les détails fournis
        const { data } = await axios.put(
            `/api/orders/${id}/pay/`,
            paymentResult,
            config
        );

        // Dispatch de l'action indiquant que la mise à jour du paiement de la commande a réussi avec les données mises à jour
        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur lors de la mise à jour du paiement de la commande, dispatch de l'action correspondante avec les détails de l'erreur
        dispatch({
            type: ORDER_PAY_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Met à jour le statut de livraison d'une commande.
 * @param {Object} order - La commande à marquer comme livrée.
 * @returns {Function} Fonction async pour dispatch une action Redux.
 */
export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        // Dispatch de l'action indiquant que la mise à jour de la livraison de la commande est en cours
        dispatch({
            type: ORDER_DELIVER_REQUEST,
        });

        // Récupération des informations de connexion de l'utilisateur depuis l'état Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration de la requête HTTP avec les en-têtes appropriés (type de contenu et authentification)
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Envoi de la requête PUT pour mettre à jour le statut de livraison de la commande
        const { data } = await axios.put(
            `/api/orders/${order._id}/deliver/`,
            {},
            config
        );

        // Dispatch de l'action indiquant que la mise à jour de la livraison de la commande a réussi avec les données mises à jour
        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur lors de la mise à jour de la livraison de la commande, dispatch de l'action correspondante avec les détails de l'erreur
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Récupère la liste des commandes de l'utilisateur actuellement connecté.
 * @returns {Function} Fonction async pour dispatch une action Redux.
 */
export const listMyOrders = () => async (dispatch, getState) => {
    try {
        // Dispatch de l'action indiquant que la récupération des commandes de l'utilisateur est en cours
        dispatch({
            type: ORDER_LIST_MY_REQUEST,
        });

        // Récupération des informations de connexion de l'utilisateur depuis l'état Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration de la requête HTTP avec les en-têtes appropriés (type de contenu et authentification)
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Envoi de la requête GET pour récupérer les commandes de l'utilisateur actuellement connecté
        const { data } = await axios.get(`/api/orders/myorders/`, config);

        // Dispatch de l'action indiquant que la récupération des commandes de l'utilisateur a réussi avec les données récupérées
        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur lors de la récupération des commandes de l'utilisateur, dispatch de l'action correspondante avec les détails de l'erreur
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Récupère la liste de toutes les commandes (pour les utilisateurs administrateurs).
 * @returns {Function} Fonction async pour dispatch une action Redux.
 */
export const listOrders = () => async (dispatch, getState) => {
    try {
        // Dispatch de l'action indiquant que la récupération de toutes les commandes est en cours
        dispatch({
            type: ORDER_LIST_REQUEST,
        });

        // Récupération des informations de connexion de l'utilisateur depuis l'état Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration de la requête HTTP avec les en-têtes appropriés (type de contenu et authentification)
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Envoi de la requête GET pour récupérer toutes les commandes (pour les utilisateurs administrateurs)
        const { data } = await axios.get(`/api/orders/`, config);

        // Dispatch de l'action indiquant que la récupération de toutes les commandes a réussi avec les données récupérées
        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur lors de la récupération de toutes les commandes, dispatch de l'action correspondante avec les détails de l'erreur
        dispatch({
            type: ORDER_LIST_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};
