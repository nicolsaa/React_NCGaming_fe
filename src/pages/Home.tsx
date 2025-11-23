import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Pause
} from 'lucide-react';

// Import static assets from src/assets/images
import img1 from '@/assets/images/1.png';
import img2 from '@/assets/images/2.png';
import img3 from '@/assets/images/3.png';
import accesoriosImg from '@/assets/images/accesorios.png';
import silenthillImg from '@/assets/images/silenthill carrusel.png';
import galFiguras from '@/assets/images/GaleriaFiguras.png';
import galCartas from '@/assets/images/GaleriaCartas.png';
import galAcc from '@/assets/images/GaleriaAccesorios.png';
import galRopa from '@/assets/images/GaleriaRopa.png';
import galJuegos from '@/assets/images/GalleriaJuegos.png';
import envioImg from '@/assets/images/envio.png';
import seguroImg from '@/assets/images/seguro.png';
import garantiaImg from '@/assets/images/garantia.png';
import originalImg from '@/assets/images/original.png';

// Brands images
import HunterImg from '@/assets/images/HunterxHunter.png';
import KimetsuImg from '@/assets/images/KimetsuNoYaiba.png';
import NarutoImg from '@/assets/images/Naruto.png';
import OnePieceImg from '@/assets/images/OnePiece.png';
import SailorMoonImg from '@/assets/images/SailorMoon.png';
import SpyXImg from '@/assets/images/SpyXFamily.png';
import BandaiImg from '@/assets/images/Bandai-Logo.png';
import CallOfDutyImg from '@/assets/images/pngimg.com - call_of_duty_PNG52.png';
import PokemonImg from '@/assets/images/pokemon-logo-text-png-7.png';
import SilentHillImg from '@/assets/images/Silent_Hill_f_logo.png';

const Home: React.FC = () => {
    const { featuredProducts, loading } = useProducts();

    // Estados para el carrusel principal
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);

    // Referencia para el carrusel de marcas
    const brandsTrackRef = useRef<HTMLDivElement>(null);

    // Imágenes del carrusel principal (ahora usando imports)
    const carouselImages = [
        { src: img1, alt: 'carrusel pokemon', link: '/catalogo-cartas' },
        { src: img2, alt: 'carrusel ropa', link: '/catalogo-ropa' },
        { src: img3, alt: 'carrusel figuras', link: '/catalogo-figuras' },
        { src: accesoriosImg, alt: 'carrusel accesorios', link: '/catalogo-accesorios' },
        { src: silenthillImg, alt: 'carrusel silentHillF', link: '/catalogo-juegos' },
    ];

    // Galería de categorías
    const galleryItems = [
        {
            src: galFiguras,
            alt: 'Figura de colección',
            title: 'Figura Limited Edition',
            description: 'Gran selección de figuras originales',
            link: '/catalogo-figuras',
            className: 'col-span-1 row-span-2'
        },
        {
            src: galCartas,
            alt: 'Cartas Pokémon',
            title: 'Cartas Pokémon Raras',
            description: 'Colección de cartas especiales',
            link: '/catalogo-cartas',
            className: 'col-span-1'
        },
        {
            src: galAcc,
            alt: 'Accesorios',
            title: 'Accesorios',
            description: 'Gran selección de accesorios',
            link: '/catalogo-accesorios',
            className: 'col-span-2'
        },
        {
            src: galRopa,
            alt: 'Ropa temática',
            title: 'Ropa Coleccionable',
            description: 'Prendas exclusivas de edición limitada',
            link: '/catalogo-ropa',
            className: 'col-span-1'
        },
        {
            src: galJuegos,
            alt: 'Videojuegos',
            title: 'Videojuegos Exclusivos',
            description: 'Los títulos más buscados',
            link: '/catalogo-juegos',
            className: 'col-span-1'
        }
    ];

    // Marcas
    const brands: string[] = [
        HunterImg,
        KimetsuImg,
        NarutoImg,
        OnePieceImg,
        SailorMoonImg,
        SpyXImg,
        BandaiImg,
        CallOfDutyImg,
        PokemonImg,
        SilentHillImg
    ];

    // Beneficios
    const benefits = [
        { src: envioImg, alt: 'Envío', text: 'Envío Rápido' },
        { src: seguroImg, alt: 'Compra Segura', text: 'Compra Segura' },
        { src: garantiaImg, alt: 'Garantía', text: 'Garantía' },
        { src: originalImg, alt: 'Original', text: 'Productos Originales' }
    ];

    // Efecto para el carrusel automático
    useEffect(() => {
        if (!isAutoplay) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoplay, carouselImages.length]);

    // Efecto para el carrusel infinito de marcas
    useEffect(() => {
        const track = brandsTrackRef.current;
        if (!track) return;

        let animationFrame: number;
        let position = 0;

        const animate = () => {
            position -= 1;
            if (position <= -track.scrollWidth / 2) {
                position = 0;
            }
            track.style.transform = `translateX(${position}px)`;
            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const toggleAutoplay = () => {
        setIsAutoplay(!isAutoplay);
    };

    return (
        <div className="space-y-16">
            {/* Carrusel Principal */}
            <section className="relative">
                <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
                    {carouselImages.map((image, index) => (
                        <Link
                            key={index}
                            to={image.link}
                            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    ))}
                </div>

                {/* Controles del carrusel */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>

                {/* Control de autoplay */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                    onClick={toggleAutoplay}
                >
                    {isAutoplay ? (
                        <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pausar
                        </>
                    ) : (
                        <>
                            <Play className="h-4 w-4 mr-1" />
                            Reproducir
                        </>
                    )}
                </Button>
            </section>

            {/* Galería de Categorías */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
                    {galleryItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className={`relative group overflow-hidden rounded-lg ${item.className}`}
                        >
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <div className="text-white">
                                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                    <p className="text-sm opacity-90">{item.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Sección Únete */}
            <section className="text-center py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">
                        ÚNETE
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 font-bebas">
                        A la gran comunidad de N&C Gaming y entérate de todas las novedades. <br />
                        ¿Qué esperas?
                    </p>
                    <Link to="/register">
                        <Button size="lg" variant="secondary" className="text-purple-600 font-semibold">
                            Registrarse Ahora
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Iconos de Beneficios */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <Card key={index} className="text-center border-0 shadow-none">
                            <CardContent className="p-6">
                                <img
                                    src={benefit.src}
                                    alt={benefit.alt}
                                    className="w-16 h-16 mx-auto mb-4 object-contain"
                                />
                                <p className="font-semibold text-gray-800">{benefit.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Productos Destacados */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Productos Destacados
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Descubre nuestros productos más populares y novedades exclusivas
                    </p>
                </div>
                <ProductGrid products={featuredProducts} loading={loading} />
                <div className="text-center mt-8">
                    <Link to="/catalogo-figuras">
                        <Button size="lg" variant="outline">
                            Ver Todos los Productos
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Sección Nuestras Marcas */}
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-orbitron">
                            NUESTRAS MARCAS
                        </h2>
                    </div>

                    {/* Carrusel de Marcas */}
                    <div className="relative overflow-hidden py-4">
                        <div
                            ref={brandsTrackRef}
                            className="flex space-x-8"
                            style={{ width: 'max-content' }}
                        >
                            {[...brands, ...brands].map((brandSrc, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center p-2"
                                >
                                    <img
                                        src={brandSrc}
                                        alt={`Marca ${index + 1}`}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default Home;