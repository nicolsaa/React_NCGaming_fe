import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
} from 'lucide-react';

// Galería
import Gallery from "@/pages/Gallery";

// Carrusel principal (import de imágenes)
import img1 from "@/assets/images/1.png";
import img2 from "@/assets/images/2.png";
import img3 from "@/assets/images/3.png";
import accesoriosImg from "@/assets/images/accesorios.png";
import silenthillImg from "@/assets/images/silenthill carrusel.png";

// Beneficios
import envioImg from "@/assets/images/envio.png";
import seguroImg from "@/assets/images/seguro.png";
import garantiaImg from "@/assets/images/garantia.png";
import originalImg from "@/assets/images/original.png";

// Logos Marcas
import HunterImg from "@/assets/images/HunterxHunter.png";
import KimetsuImg from "@/assets/images/KimetsuNoYaiba.png";
import NarutoImg from "@/assets/images/Naruto.png";
import OnePieceImg from "@/assets/images/OnePiece.png";
import SailorMoonImg from "@/assets/images/SailorMoon.png";
import SpyXImg from "@/assets/images/SpyXFamily.png";
import BandaiImg from "@/assets/images/Bandai-Logo.png";
import CallOfDutyImg from "@/assets/images/pngimg.com - call_of_duty_PNG52.png";
import PokemonImg from "@/assets/images/pokemon-logo-text-png-7.png";
import SilentHillImg from "@/assets/images/Silent_Hill_f_logo.png";

const Home: React.FC = () => {
    const { featuredProducts, loading } = useProducts();

    // Estado carrusel
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);

    // Ref para marcas
    const brandsTrackRef = useRef<HTMLDivElement>(null);

    // Slider principal
    const carouselImages = [
        { src: img1, alt: 'carrusel pokemon', link: '/catalogo-cartas' },
        { src: img2, alt: 'carrusel ropa', link: '/catalogo-ropa' },
        { src: img3, alt: 'carrusel figuras', link: '/catalogo-figuras' },
        { src: accesoriosImg, alt: 'carrusel accesorios', link: '/catalogo-accesorios' },
        { src: silenthillImg, alt: 'carrusel silentHillF', link: '/catalogo-juegos' },
    ];


    const brands = [
        HunterImg, KimetsuImg, NarutoImg, OnePieceImg, SailorMoonImg,
        SpyXImg, BandaiImg, CallOfDutyImg, PokemonImg, SilentHillImg,
    ];

    const benefits = [
        { src: envioImg, alt: "Envío" },
        { src: seguroImg, alt: "Compra Segura" },
        { src: garantiaImg, alt: "Garantía" },
        { src: originalImg, alt: "Original" },
    ];

    // Autoplay carrusel
    useEffect(() => {
        if (!isAutoplay) return;
        const interval = setInterval(
            () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length),
            4000
        );
        return () => clearInterval(interval);
    }, [isAutoplay]);

    // Animación marcas
    useEffect(() => {
        const track = brandsTrackRef.current;
        if (!track) return;
        let position = 0;
        const move = () => {
            position -= 1;
            if (position <= -track.scrollWidth / 2) position = 0;
            track.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(move);
        };
        move();
    }, []);

    return (
        <div className="space-y-16">

            {/* 🔥 Carrusel principal */}
            <section className="relative">
                <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                    {carouselImages.map((img, i) => (
                        <Link key={i} to={img.link} className={`absolute inset-0 transition-opacity duration-500 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}>
                            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                        </Link>
                    ))}
                </div>

                {/* Controles */}
                <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}>
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)}>
                    <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {carouselImages.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white scale-125" : "bg-white/50"}`} />
                    ))}
                </div>

                {/* Autoplay */}
                <Button variant="ghost" size="sm" className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                    onClick={() => setIsAutoplay(!isAutoplay)}>
                    {isAutoplay ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isAutoplay ? "Pausar" : "Reproducir"}
                </Button>
            </section>

            {/* 🔥 Galería personalizada */}
            <section className="container mx-auto my-16">
                <Gallery />
            </section>


            {/* 🔥 Beneficios */}
            <section className="container mx-auto text-center my-16 px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 justify-center">
                    {benefits.map((b, index) => (
                        <div key={index}>
                            <img src={b.src} alt={b.alt} className="w-[350px] h-[350px] mx-auto object-contain" />
                            <p className="mt-2 font-medium">{b.alt}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🔥 Productos Destacados */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold">Productos Destacados</h2>
                    <p className="text-gray-600">Descubre nuestros productos más populares</p>
                </div>
                <ProductGrid products={featuredProducts} loading={loading} />
                <div className="text-center mt-8">
                    <Link to="/catalogo-figuras">
                        <Button size="lg" variant="outline">Ver Todos los Productos</Button>
                    </Link>
                </div>
            </section>

            {/* 🔥 Carrusel Marcas */}
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 text-center mb-6">
                    <h2 className="text-4xl font-bold">NUESTRAS MARCAS</h2>
                </div>
                <div className="overflow-hidden py-4">
                    <div ref={brandsTrackRef} className="flex space-x-8" style={{ width: "max-content" }}>
                        {[...brands, ...brands].map((src, i) => (
                            <div key={i} className="w-56 h-28 bg-white shadow rounded-lg flex items-center justify-center p-4">
                                <img src={src} alt="marca" className="max-w-full max-h-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
