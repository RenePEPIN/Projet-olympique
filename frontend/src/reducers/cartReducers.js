import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_CLEAR_ITEMS,
} from '../constants/cartConstants';

/**
 * Réduit le state du panier.
 * @param {object} state - État actuel du panier.
 * @param {object} action - Action à effectuer.
 * @returns {object} Nouvel état du panier.
 */
export const cartReducer = (
    state = { cartItems: [], shippingAddress: {} },
    action
) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            // Ajoute un nouvel article au panier ou met à jour la quantité d'un article existant.
            const item = action.payload;
            const existItem = state.cartItems.find(
                (x) => x.product === item.product
            );

            if (existItem) {
                // Si l'article existe déjà, met à jour sa quantité.
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? item : x
                    ),
                };
            } else {
                // Si l'article est nouveau, l'ajoute au panier.
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }

        case CART_REMOVE_ITEM:
            // Supprime un article du panier.
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (x) => x.product !== action.payload
                ),
            };

        case CART_SAVE_SHIPPING_ADDRESS:
            // Enregistre l'adresse de livraison dans le state du panier.
            return {
                ...state,
                shippingAddress: action.payload,
            };

        case CART_SAVE_PAYMENT_METHOD:
            // Enregistre le mode de paiement dans le state du panier.
            return {
                ...state,
                paymentMethod: action.payload,
            };

        case CART_CLEAR_ITEMS:
            // Vide le panier en supprimant tous les articles.
            return {
                ...state,
                cartItems: [],
            };

        default:
            return state;
    }
};
