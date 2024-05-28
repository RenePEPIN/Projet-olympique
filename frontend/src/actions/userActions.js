// Import des bibliothèques nécessaires
import axios from 'axios'; // Pour effectuer des requêtes HTTP
import {
    // Import des constantes pour les actions liées aux utilisateurs
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
} from '../constants/userConstants'; // Import des constantes pour les actions liées aux utilisateurs

import { ORDER_LIST_MY_RESET } from '../constants/orderConstants'; // Import des constantes pour les actions liées aux commandes

/**
 * Fonction pour l'authentification de l'utilisateur.
 * @param {string} email - L'adresse e-mail de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Function} Fonction d'action Redux.
 */
export const login = (email, password) => async (dispatch) => {
    try {
        // Déclenchement de la requête de connexion
        dispatch({ type: USER_LOGIN_REQUEST });

        // Configuration pour la requête HTTP
        const config = {
            headers: {
                'Content-type': 'application/json', // Type de contenu JSON
            },
        };

        // Envoi de la requête POST pour l'authentification
        const { data } = await axios.post(
            '/api/users/login/', // URL de l'API pour la connexion
            { username: email, password: password }, // Corps de la requête avec email et mot de passe
            config // Configuration de la requête
        );

        // Dispatch de l'action pour la réussite de la connexion avec les données utilisateur
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data, // Les données de l'utilisateur connecté
        });

        // Stockage des informations de l'utilisateur dans le stockage local du navigateur
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        // Dispatch de l'action en cas d'échec de la connexion avec le message d'erreur approprié
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Fonction pour la déconnexion de l'utilisateur.
 * @returns {Function} Fonction d'action Redux.
 */
export const logout = () => (dispatch) => {
    // Suppression des informations utilisateur du stockage local du navigateur
    localStorage.removeItem('userInfo');

    // Dispatch de l'action pour la déconnexion
    dispatch({ type: USER_LOGOUT });

    // Réinitialisation des détails de l'utilisateur dans le state Redux
    dispatch({ type: USER_DETAILS_RESET });

    // Réinitialisation de la liste des commandes personnelles dans le state Redux
    dispatch({ type: ORDER_LIST_MY_RESET });

    // Réinitialisation de la liste des utilisateurs dans le state Redux
    dispatch({ type: USER_LIST_RESET });
};

/**
 * Fonction pour l'enregistrement d'un nouvel utilisateur.
 * @param {string} name - Le nom de l'utilisateur.
 * @param {string} email - L'adresse e-mail de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Function} Fonction d'action Redux.
 */
export const register = (name, email, password) => async (dispatch) => {
    try {
        // Déclenchement de la requête d'enregistrement d'utilisateur
        dispatch({ type: USER_REGISTER_REQUEST });

        // Configuration pour la requête HTTP
        const config = {
            headers: {
                'Content-type': 'application/json', // Type de contenu JSON
            },
        };

        // Envoi de la requête POST pour l'enregistrement d'utilisateur
        const { data } = await axios.post(
            '/api/users/register/', // URL de l'API pour l'enregistrement
            { name: name, email: email, password: password }, // Corps de la requête avec nom, email et mot de passe
            config // Configuration de la requête
        );

        // Dispatch de l'action pour la réussite de l'enregistrement avec les données utilisateur
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data, // Les données de l'utilisateur enregistré
        });

        // Dispatch de l'action pour la réussite de la connexion avec les données utilisateur
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data, // Les données de l'utilisateur enregistré
        });

        // Stockage des informations de l'utilisateur dans le stockage local du navigateur
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        // Dispatch de l'action en cas d'échec de l'enregistrement avec le message d'erreur approprié
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Fonction pour obtenir les détails d'un utilisateur.
 * @param {string} id - L'ID de l'utilisateur.
 * @returns {Function} Fonction d'action Redux.
 */
export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        // Déclenchement de la requête pour obtenir les détails de l'utilisateur
        dispatch({ type: USER_DETAILS_REQUEST });

        // Récupération des informations de connexion de l'utilisateur depuis le state Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration pour la requête HTTP avec l'authentification JWT
        const config = {
            headers: {
                'Content-type': 'application/json', // Type de contenu JSON
                Authorization: `Bearer ${userInfo.token}`, // Token JWT d'authentification
            },
        };

        // Envoi de la requête GET pour obtenir les détails de l'utilisateur
        const { data } = await axios.get(`/api/users/${id}/`, config); // URL de l'API pour obtenir les détails de l'utilisateur

        // Dispatch de l'action pour la réussite de l'obtention des détails de l'utilisateur avec les données obtenues
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data, // Les détails de l'utilisateur obtenus
        });
    } catch (error) {
        // Dispatch de l'action en cas d'échec de l'obtention des détails de l'utilisateur avec le message d'erreur approprié
        dispatch({
            type: USER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Fonction pour mettre à jour le profil de l'utilisateur.
 * @param {object} user - Les nouvelles informations de l'utilisateur.
 * @returns {Function} Fonction d'action Redux.
 */
export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        // Déclenchement de la requête pour mettre à jour le profil de l'utilisateur
        dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

        // Récupération des informations de connexion de l'utilisateur depuis le state Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration pour la requête HTTP avec l'authentification JWT
        const config = {
            headers: {
                'Content-type': 'application/json', // Type de contenu JSON
                Authorization: `Bearer ${userInfo.token}`, // Token JWT d'authentification
            },
        };

        // Envoi de la requête PUT pour mettre à jour le profil de l'utilisateur
        const { data } = await axios.put(
            `/api/users/profile/update/`, // URL de l'API pour mettre à jour le profil de l'utilisateur
            user, // Corps de la requête avec les nouvelles informations de l'utilisateur
            config // Configuration de la requête
        );

        // Dispatch de l'action pour la réussite de la mise à jour du profil avec les données mises à jour
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data, // Les données mises à jour du profil de l'utilisateur
        });

        // Dispatch de l'action pour la réussite de la connexion avec les données mises à jour du profil
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data, // Les données mises à jour du profil de l'utilisateur
        });

        // Stockage des informations de l'utilisateur dans le stockage local du navigateur
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        // Dispatch de l'action en cas d'échec de la mise à jour du profil avec le message d'erreur approprié
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Fonction pour lister tous les utilisateurs (administrateurs uniquement).
 * @returns {Function} Fonction d'action Redux.
 */
export const listUsers = () => async (dispatch, getState) => {
    try {
        // Déclenchement de la requête pour lister tous les utilisateurs
        dispatch({ type: USER_LIST_REQUEST });

        // Récupération des informations de connexion de l'utilisateur depuis le state Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration pour la requête HTTP avec l'authentification JWT
        const config = {
            headers: {
                'Content-type': 'application/json', // Type de contenu JSON
                Authorization: `Bearer ${userInfo.token}`, // Token JWT d'authentification
            },
        };

        // Envoi de la requête GET pour lister tous les utilisateurs
        const { data } = await axios.get(`/api/users/`, config); // URL de l'API pour lister tous les utilisateurs

        // Dispatch de l'action pour la réussite de la liste des utilisateurs avec les données obtenues
        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data, // La liste des utilisateurs obtenue
        });
    } catch (error) {
        // Dispatch de l'action en cas d'échec de la liste des utilisateurs avec le message d'erreur approprié
        dispatch({
            type: USER_LIST_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Fonction pour supprimer un utilisateur (administrateurs uniquement).
 * @param {string} id - L'ID de l'utilisateur à supprimer.
 * @returns {Function} Fonction d'action Redux.
 */
export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        // Déclenchement de la requête pour supprimer un utilisateur
        dispatch({ type: USER_DELETE_REQUEST });

        // Récupération des informations de connexion de l'utilisateur depuis le state Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration pour la requête HTTP avec l'authentification JWT
        const config = {
            headers: {
                'Content-type': 'application/json', // Type de contenu JSON
                Authorization: `Bearer ${userInfo.token}`, // Token JWT d'authentification
            },
        };

        // Envoi de la requête DELETE pour supprimer un utilisateur
        const { data } = await axios.delete(
            `/api/users/delete/${id}/`, // URL de l'API pour supprimer un utilisateur avec l'ID spécifié
            config // Configuration de la requête
        );

        // Dispatch de l'action pour la réussite de la suppression de l'utilisateur avec les données obtenues
        dispatch({
            type: USER_DELETE_SUCCESS,
            payload: data, // Les données de la suppression de l'utilisateur
        });
    } catch (error) {
        // Dispatch de l'action en cas d'échec de la suppression de l'utilisateur avec le message d'erreur approprié
        dispatch({
            type: USER_DELETE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

/**
 * Fonction pour mettre à jour un utilisateur (administrateurs uniquement).
 * @param {object} user - Les nouvelles informations de l'utilisateur.
 * @returns {Function} Fonction d'action Redux.
 */
export const updateUser = (user) => async (dispatch, getState) => {
    try {
        // Déclenchement de la requête pour mettre à jour un utilisateur
        dispatch({ type: USER_UPDATE_REQUEST });

        // Récupération des informations de connexion de l'utilisateur depuis le state Redux
        const {
            userLogin: { userInfo },
        } = getState();

        // Configuration pour la requête HTTP avec l'authentification JWT
        const config = {
            headers: {
                'Content-type': 'application/json', // Type de contenu JSON
                Authorization: `Bearer ${userInfo.token}`, // Token JWT d'authentification
            },
        };

        // Envoi de la requête PUT pour mettre à jour un utilisateur
        const { data } = await axios.put(
            `/api/users/update/${user._id}/`, // URL de l'API pour mettre à jour un utilisateur avec l'ID spécifié
            user, // Corps de la requête avec les nouvelles informations de l'utilisateur
            config // Configuration de la requête
        );

        // Dispatch de l'action pour la réussite de la mise à jour de l'utilisateur
        dispatch({ type: USER_UPDATE_SUCCESS });

        // Dispatch de l'action pour la réussite de la mise à jour des détails de l'utilisateur avec les nouvelles données
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data, // Les nouvelles données de l'utilisateur mises à jour
        });
    } catch (error) {
        // Dispatch de l'action en cas d'échec de la mise à jour de l'utilisateur avec le message d'erreur approprié
        dispatch({
            type: USER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};
