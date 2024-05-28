import axios from 'axios';
import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    // PRODUCT_CREATE_REVIEW_REQUEST,
    // PRODUCT_CREATE_REVIEW_SUCCESS,
    // PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_TOP_REQUEST,
    PRODUCT_TOP_SUCCESS,
    PRODUCT_TOP_FAIL,
} from '../constants/productConstants';

/**
 * Liste les produits.
 * @param {string} keyword - Le mot-clé de recherche (facultatif).
 * @returns {Function} Fonction d'action Redux.
 */
// Fonction pour lister les produits
export const listProducts =
    (keyword = '') =>
    async (dispatch) => {
        try {
            // Requête de liste de produits en cours
            dispatch({ type: PRODUCT_LIST_REQUEST });

            // Appel à l'API pour récupérer les produits
            const { data } = await axios.get(`/api/products${keyword}`);

            // Mise à jour du state avec les produits récupérés
            dispatch({
                type: PRODUCT_LIST_SUCCESS,
                payload: data,
            });
        } catch (error) {
            // En cas d'erreur, mise à jour du state avec le message d'erreur
            dispatch({
                type: PRODUCT_LIST_FAIL,
                payload:
                    error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message,
            });
        }
    };

/**
 * Liste les produits les mieux notés.
 * @returns {Function} Fonction d'action Redux.
 */
// Fonction pour lister les produits les mieux notés
export const listTopProducts = () => async (dispatch) => {
    try {
        // Requête pour les produits les mieux notés en cours
        dispatch({ type: PRODUCT_TOP_REQUEST });

        // Appel à l'API pour récupérer les produits les mieux notés
        const { data } = await axios.get(`/api/products/top/`);

        // Mise à jour du state avec les produits les mieux notés
        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur, mise à jour du state avec le message d'erreur
        dispatch({
            type: PRODUCT_TOP_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Obtient les détails d'un produit.
 * @param {string} id - L'ID du produit.
 * @returns {Function} Fonction d'action Redux.
 */
// Fonction pour obtenir les détails d'un produit
export const listProductDetails = (id) => async (dispatch) => {
    try {
        // Requête pour les détails d'un produit en cours
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        // Appel à l'API pour récupérer les détails du produit spécifié
        const { data } = await axios.get(`/api/products/${id}`);

        // Mise à jour du state avec les détails du produit
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur, mise à jour du state avec le message d'erreur
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Supprime un produit.
 * @param {string} id - L'ID du produit.
 * @returns {Function} Fonction d'action Redux.
 */
// Fonction pour supprimer un produit
export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        // Requête de suppression de produit en cours
        dispatch({
            type: PRODUCT_DELETE_REQUEST,
        });

        // eslint-disable-next-line no-empty-pattern
        const {} = getState();

        // Suppression réussie, mise à jour du state
        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
        });
    } catch (error) {
        // En cas d'erreur, mise à jour du state avec le message d'erreur
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Crée un nouveau produit.
 * @returns {Function} Fonction d'action Redux.
 */
// Fonction pour créer un produit
export const createProduct = () => async (dispatch, getState) => {
    try {
        // Requête de création de produit en cours
        dispatch({
            type: PRODUCT_CREATE_REQUEST,
        });

        // Récupération des informations de l'utilisateur connecté
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration de l'en-tête de la requête
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Appel à l'API pour créer un nouveau produit
        const { data } = await axios.post(`/api/products/create/`, {}, config);
        // Mise à jour du state avec les détails du nouveau produit
        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur, mise à jour du state avec le message d'erreur
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Met à jour un produit existant.
 * @param {object} product - Le produit à mettre à jour.
 * @returns {Function} Fonction d'action Redux.
 */
// Fonction pour mettre à jour un produit
export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        // Requête de mise à jour de produit en cours
        dispatch({
            type: PRODUCT_UPDATE_REQUEST,
        });

        // Récupération des informations de l'utilisateur connecté
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration de l'en-tête de la requête
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Appel à l'API pour mettre à jour un produit existant
        const { data } = await axios.put(
            `/api/products/update/${product._id}/`,
            product,
            config
        );
        // Mise à jour du state avec les détails du produit mis à jour
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data,
        });

        // Mise à jour des détails du produit après la mise à jour
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // En cas d'erreur, mise à jour du state avec le message d'erreur
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

// /**
//  * Crée une critique pour un produit.
//  * @param {string} productId - L'ID du produit à critiquer.
//  * @param {object} review - La critique à ajouter.
//  * @returns {Function} Fonction d'action Redux.
//  */
// // Fonction pour créer une critique de produit
// export const createProductReview =
//     (productId, review) => async (dispatch, getState) => {
//         try {
//             // Requête de création de critique de produit en cours
//             dispatch({
//                 type: PRODUCT_CREATE_REVIEW_REQUEST,
//             });

//             // Récupération des informations de l'utilisateur connecté
//             const {
//                 userLogin: { userInfo },
//             } = getState();

//             // Configuration de l'en-tête de la requête
//             const config = {
//                 headers: {
//                     'Content-type': 'application/json',
//                     Authorization: `Bearer ${userInfo.token}`,
//                 },
//             };

//             // Appel à l'API pour créer une nouvelle critique de produit
//             const { data } = await axios.post(
//                 `/api/products/${productId}/reviews/`,
//                 review,
//                 config
//             );
//             // Mise à jour du state avec les détails de la critique de produit créée
//             dispatch({
//                 type: PRODUCT_CREATE_REVIEW_SUCCESS,
//                 payload: data,
//             });
//         } catch (error) {
//             // En cas d'erreur, mise à jour du state avec le message d'erreur
//             dispatch({
//                 type: PRODUCT_CREATE_REVIEW_FAIL,
//                 payload:
//                     error.response && error.response.data.detail
//                         ? error.response.data.detail
//                         : error.message,
//             });
//         }
//     };
