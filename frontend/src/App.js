import { Container } from 'react-bootstrap';
import { HashRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderListScreen from './screens/OrderListScreen';

/**
 * Composant racine de l'application.
 * @returns {JSX.Element} Élément JSX représentant l'application.
 */
function App() {
    return (
        <Router>
            <Header />
            <main className="py-3">
                <Container>
                    {/* Définition des routes pour chaque écran */}
                    <Route path="/" component={HomeScreen} exact />
                    <Route path="/login" component={LoginScreen} />
                    <Route path="/register" component={RegisterScreen} />
                    <Route path="/profile" component={ProfileScreen} />
                    <Route path="/shipping" component={ShippingScreen} />
                    <Route path="/placeorder" component={PlaceOrderScreen} />
                    <Route path="/order/:id" component={OrderScreen} />
                    <Route path="/payment" component={PaymentScreen} />
                    <Route path="/product/:id" component={ProductScreen} />
                    <Route path="/cart/:id?" component={CartScreen} />
                    {/* Route pour la liste des commandes pour les administrateurs */}
                    <Route
                        path="/admin/orderlist"
                        component={OrderListScreen}
                    />
                </Container>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
