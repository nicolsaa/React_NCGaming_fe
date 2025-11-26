import React from "react";
import { Link } from "react-router-dom";

import galFiguras from "@/assets/images/GaleriaFiguras.png";
import galCartas from "@/assets/images/GaleriaCartas.png";
import galAccesorios from "@/assets/images/GaleriaAccesorios.png";
import galRopa from "@/assets/images/GaleriaRopa.png";
import galJuegos from "@/assets/images/GalleriaJuegos.png";

const Gallery: React.FC = () => {
    return (
        <div className="gallery-container">
            <div className="gallery">

                {/* Left Column */}
                <div className="column left">
                    <Link to="/catalogo-figuras" className="gallery-item">
                        <img src={galFiguras} alt="Figuras" />
                        <div className="overlay">
                            <h3>Figura Limited Edition</h3>
                            <p>Gran selección de figuras originales</p>
                        </div>
                    </Link>

                    <Link to="/catalogo-cartas" className="gallery-item">
                        <img src={galCartas} alt="Cartas Pokémon" />
                        <div className="overlay">
                            <h3>Cartas Pokémon Raras</h3>
                            <p>Colección de cartas especiales</p>
                        </div>
                    </Link>
                </div>

                {/* Center Column */}
                <div className="column center">
                    <Link to="/catalogo-accesorios" className="gallery-item center-item">
                        <img src={galAccesorios} alt="Accesorios" />
                        <div className="overlay">
                            <h3>Accesorios</h3>
                            <p>Gran selección de accesorios</p>
                        </div>
                    </Link>
                </div>

                {/* Right Column */}
                <div className="column right">
                    <Link to="/catalogo-ropa" className="gallery-item">
                        <img src={galRopa} alt="Ropa de anime" />
                        <div className="overlay">
                            <h3>Ropa Coleccionable</h3>
                            <p>Prendas exclusivas de edición limitada</p>
                        </div>
                    </Link>

                    <Link to="/catalogo-juegos" className="gallery-item">
                        <img src={galJuegos} alt="Videojuegos" />
                        <div className="overlay">
                            <h3>Videojuegos Exclusivos</h3>
                            <p>Los títulos más buscados</p>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Gallery;
