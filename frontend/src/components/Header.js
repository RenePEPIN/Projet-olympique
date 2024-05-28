import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';

/**
 * Composant de l'en-tête de l'application.
 * Affiche la barre de navigation avec les liens vers les différentes pages et les fonctionnalités utilisateur.
 * @component
 * @returns {JSX.Element}
 */
function Header() {
    // Récupération des informations sur la connexion de l'utilisateur depuis le state Redux
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Initialisation du dispatcher Redux
    const dispatch = useDispatch();

    // Fonction de gestion de la déconnexion de l'utilisateur
    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <header>
            {/* Barre de navigation */}
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    {/* Marque de la barre de navigation redirigeant vers la page d'accueil */}
                    <LinkContainer to="/">
                        <Navbar.Brand>Billetterie olympique 2024</Navbar.Brand>
                    </LinkContainer>

                    {/* Bouton de basculement pour la navigation mobile */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Champ de recherche */}
                        <SearchBox />
                        {/* Liens de navigation */}
                        <Nav className="ml-auto">
                            {/* Lien vers le panier d'achat */}
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <i className="fas fa-shopping-cart"></i>
                                    Votre panier
                                </Nav.Link>
                            </LinkContainer>

                            {/* Menu déroulant pour l'utilisateur connecté */}
                            {userInfo ? (
                                <NavDropdown
                                    title={userInfo.name}
                                    id="username"
                                >
                                    {/* Lien vers le profil de l'utilisateur */}
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    {/* Option de déconnexion */}
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Se deconnecter
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                // Lien vers la page de connexion si l'utilisateur n'est pas connecté
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user"></i>Se
                                        connecter
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
