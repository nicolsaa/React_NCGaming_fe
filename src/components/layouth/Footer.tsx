import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Gamepad2,
    Zap,
    Heart,
    ChevronRight,
    Send,
    ShoppingBag,
    Shirt,
    GamepadIcon,
    Armchair,
} from 'lucide-react';
import { CardsIcon } from '@/components/icons/CardsIcon';

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica para suscribirse al newsletter
        console.log('Email suscrito:', email);
        setEmail('');
        alert('¡Gracias por suscribirte!');
    };

    const productLinks = [
        { href: '/catalogo-figuras', label: 'Figuras', icon: ShoppingBag },
        { href: '/catalogo-cartas', label: 'Cartas', icon: CardsIcon },
        { href: '/catalogo-ropa', label: 'Ropa', icon: Shirt },
        { href: '/catalogo-juegos', label: 'Videojuegos', icon: GamepadIcon },
        { href: '/catalogo-accesorios', label: 'Accesorios', icon: Armchair },
    ];

    const socialLinks = [
        { href: 'https://www.tiktok.com/', icon: 'tiktok', label: 'TikTok' },
        { href: 'https://www.instagram.com/', icon: 'instagram', label: 'Instagram' },
        { href: 'https://discord.com/', icon: 'discord', label: 'Discord' },
        { href: 'https://www.youtube.com/', icon: 'youtube', label: 'YouTube' },
    ];

    const renderSocialIcon = (icon: string) => {
        switch (icon) {
            case 'tiktok':
                return <span className="text-lg">🎵</span>;
            case 'instagram':
                return <span className="text-lg">📷</span>;
            case 'discord':
                return <span className="text-lg">💬</span>;
            case 'youtube':
                return <span className="text-lg">📺</span>;
            default:
                return null;
        }
    };

    return (
        <footer className="relative bg-gradient-to-r from-purple-900 to-pink-800 text-white overflow-hidden border-t-4 border-pink-300">
            {/* Anime Characters Floating */}
            <div className="absolute bottom-0 w-full flex justify-between px-8 lg:px-16 opacity-20 pointer-events-none">
                <div className="animate-bounce" style={{ animationDelay: '0s' }}>
                    <Gamepad2 className="h-16 w-16" />
                </div>
                <div className="animate-bounce" style={{ animationDelay: '1s' }}>
                    <Heart className="h-16 w-16" />
                </div>
                <div className="animate-bounce" style={{ animationDelay: '2s' }}>
                    <Zap className="h-16 w-16" />
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                                N&CGAMING
                            </h3>
                            <p className="text-gray-200 mt-4 leading-relaxed">
                                Tu tienda favorita de artículos geek. ¡Encuentra los mejores productos
                                para demostrar tu amor por la cultura anime y gaming!
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full 
                            hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 
                            transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                                    aria-label={social.label}
                                >
                                    {renderSocialIcon(social.icon)}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products Links */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold relative pb-3 
                        bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                            Productos
                            <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                        </h3>

                        <ul className="space-y-3">
                            {productLinks.map((link) => {
                                const IconComponent = link.icon;
                                return (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="flex items-center text-gray-200 hover:text-pink-300 
                                transition-all duration-300 group"
                                        >
                                            <ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                            <IconComponent className="h-4 w-4 mr-2" />
                                            {link.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold relative pb-3 
                        bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                            Newsletter
                            <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                        </h3>

                        <p className="text-gray-200">
                            ¡Suscríbete para recibir las últimas novedades y ofertas exclusivas!
                        </p>

                        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="tu.email@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-white/90 border-none text-purple-900 placeholder-purple-400 
                            rounded-full px-4 py-2 focus:ring-2 focus:ring-pink-300"
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 
                            hover:from-pink-600 hover:to-purple-600 text-white 
                            rounded-full py-2 transition-all duration-300 
                            hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Suscribirme
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-12 pt-8 text-center">
                    <p className="text-gray-300 text-sm">
                        &copy; 2025 N&C Gaming - Tu tienda Freak de confianza. | Diseñado con{' '}
                        <Heart className="inline h-4 w-4 text-red-500 fill-current" />{' '}
                        por amantes del anime
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
