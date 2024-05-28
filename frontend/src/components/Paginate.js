import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Composant de pagination.
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.pages - Le nombre total de pages.
 * @param {number} props.page - La page actuelle.
 * @param {string} props.keyword - Le mot-clé de recherche.
 * @param {boolean} props.isAdmin - Indique si l'utilisateur est un administrateur.
 * @returns {JSX.Element} Composant de pagination.
 */
function Paginate({ pages, page, keyword = '', isAdmin = false }) {
    // Extraction du mot-clé de l'URL si présent
    if (keyword) {
        keyword = keyword.split('?keyword=')[1].split('&')[0];
    }

    // Rendu du composant de pagination si plus d'une page est disponible
    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map((x) => (
                    <LinkContainer
                        key={x + 1}
                        to={
                            !isAdmin
                                ? `/?keyword=${keyword}&page=${x + 1}`
                                : `/admin/productlist/?keyword=${keyword}&page=${
                                      x + 1
                                  }`
                        }
                    >
                        {/* Affichage du numéro de page */}
                        <Pagination.Item active={x + 1 === page}>
                            {x + 1}
                        </Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
    );
}

export default Paginate;
