import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listOrders } from '../actions/orderActions';

/**
 * Écran de liste des commandes pour les administrateurs.
 * @param {object} props - Les propriétés du composant.
 * @param {object} props.history - Historique de navigation.
 * @returns {JSX.Element} Écran de liste des commandes.
 */
function OrderListScreen({ history }) {
    const dispatch = useDispatch();

    // Récupération de la liste des commandes depuis le state Redux
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;

    // Récupération des informations de connexion de l'utilisateur depuis le state Redux
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        // Vérification des droits administrateurs de l'utilisateur
        if (userInfo && userInfo.isAdmin) {
            // Si l'utilisateur est administrateur, récupération de la liste des commandes
            dispatch(listOrders());
        } else {
            // Si l'utilisateur n'est pas administrateur, redirection vers la page de connexion
            history.push('/login');
        }
    }, [dispatch, history, userInfo]);

    return (
        <div>
            <h1>Orders</h1>
            {loading ? ( // Affichage d'un spinner de chargement si les données sont en cours de chargement
                <Loader />
            ) : error ? ( // Affichage d'un message d'erreur en cas d'échec du chargement
                <Message variant="danger">{error}</Message>
            ) : (
                // Affichage de la liste des commandes sous forme de tableau
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>Total</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>
                                    {order.isPaid ? (
                                        // Affichage de la date de paiement si la commande est payée
                                        order.paidAt.substring(0, 10)
                                    ) : (
                                        // Affichage d'une icône si la commande n'est pas payée
                                        <i
                                            className="fas fa-check"
                                            style={{ color: 'red' }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered ? (
                                        // Affichage de la date de livraison si la commande est livrée
                                        order.deliveredAt.substring(0, 10)
                                    ) : (
                                        // Affichage d'une icône si la commande n'est pas livrée
                                        <i
                                            className="fas fa-check"
                                            style={{ color: 'red' }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        {/* Bouton pour voir les détails de la commande */}
                                        <Button
                                            variant="light"
                                            className="btn-sm"
                                        >
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default OrderListScreen;
