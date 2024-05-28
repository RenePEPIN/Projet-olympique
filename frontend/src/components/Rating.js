import React from 'react';

/**
 * Composant pour afficher une notation sous forme d'étoiles.
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.value - La valeur de la notation (de 0 à 5).
 * @param {string} props.text - Le texte optionnel à afficher à côté de la notation.
 * @param {string} props.color - La couleur des étoiles.
 * @returns {JSX.Element} Composant React pour la notation.
 */
function Rating({ value, text, color }) {
    return (
        <div className="rating">
            {/* Première étoile */}
            <span>
                <i
                    style={{ color }}
                    className={
                        value >= 1
                            ? 'fas fa-star' // Si la valeur est supérieure ou égale à 1, affiche une étoile pleine
                            : value >= 0.5
                            ? 'fas fa-star-half-alt' // Si la valeur est supérieure ou égale à 0.5, affiche une demi-étoile
                            : 'far fa-star' // Sinon, affiche une étoile vide
                    }
                />
            </span>

            {/* Deuxième étoile */}
            <span>
                <i
                    style={{ color }}
                    className={
                        value >= 2
                            ? 'fas fa-star'
                            : value >= 1.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                    }
                />
            </span>

            {/* Troisième étoile */}
            <span>
                <i
                    style={{ color }}
                    className={
                        value >= 3
                            ? 'fas fa-star'
                            : value >= 2.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                    }
                />
            </span>

            {/* Quatrième étoile */}
            <span>
                <i
                    style={{ color }}
                    className={
                        value >= 4
                            ? 'fas fa-star'
                            : value >= 3.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                    }
                />
            </span>

            {/* Cinquième étoile */}
            <span>
                <i
                    style={{ color }}
                    className={
                        value >= 5
                            ? 'fas fa-star'
                            : value >= 4.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                    }
                />
            </span>

            {/* Affichage du texte de la notation si présent */}
            <span>{text && text}</span>
        </div>
    );
}

export default Rating;
