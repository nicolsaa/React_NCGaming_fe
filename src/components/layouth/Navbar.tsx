import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Menu, ShoppingCart, User, LogOut, UserCircle, ShoppingBag } from 'lucide-react';
import Logo_sin_Fondo from '@/assets/images/Logo_sin_Fondo.png'



const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { cartItems } = useCart();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/catalogo-figuras', label: 'Figuras' },
        { href: '/catalogo-cartas', label: 'Cartas' },
        { href: '/catalogo-ropa', label: 'Ropa' },
        { href: '/catalogo-juegos', label: 'Videojuegos' },
        { href: '/catalogo-accesorios', label: 'Accesorios' },
    ];

    const isActiveLink = (path: string) => location.pathname === path;

    return (
        <nav className={`
        sticky top-0 z-50 transition-all duration-300
        ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg'
                : 'bg-white'
            }
    `}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src={Logo_sin_Fondo}
                            alt="N&CGAMING"
                            className="w-10 h-10"
                        />
                        <span className="text-xl font-bold text-gray-900">N&CGAMING</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`
                    relative font-medium transition-colors duration-200
                    ${isActiveLink(link.href)
                                        ? 'text-purple-600'
                                        : 'text-gray-700 hover:text-purple-600'
                                    }
                    after:content-[''] after:absolute after:bottom-0 after:left-0 
                    after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500
                    after:transition-all after:duration-300
                    ${isActiveLink(link.href) ? 'after:w-full' : 'after:w-0'}
                    hover:after:w-full
                `}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Admin Links */}
                        {user?.role === 'ADMIN' && (
                            <>
                                <Link
                                    to="/admin"
                                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                                >
                                    Admin Productos
                                </Link>
                                <Link
                                    to="/admin-usuarios"
                                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                                >
                                    Admin Usuarios
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Desktop Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Cart Icon */}
                        <Link to="/carrito">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cartItemsCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                    >
                                        {cartItemsCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-2 py-1.5">
                                        <p className="text-sm font-semibold">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/perfil" className="cursor-pointer">
                                            <UserCircle className="mr-2 h-4 w-4" />
                                            Mi Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/pedidos" className="cursor-pointer">
                                            <ShoppingBag className="mr-2 h-4 w-4" />
                                            Mis Pedidos
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to="/login">
                                <Button variant="default" size="sm">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col h-full">
                                {/* Logo */}
                                <div className="flex items-center space-x-2 mb-8">
                                    <img src={Logo_sin_Fondo} alt="N&CGAMING" className="w-8 h-8" />
                                    <span className="text-lg font-bold">N&CGAMING</span>
                                </div>

                                {/* Mobile Navigation Links */}
                                <div className="flex-1 space-y-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`
                        block text-lg font-medium transition-colors
                        ${isActiveLink(link.href)
                                                    ? 'text-purple-600'
                                                    : 'text-gray-700 hover:text-purple-600'
                                                }
                        `}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    {/* Admin Links in Mobile */}
                                    {user?.role === 'ADMIN' && (
                                        <>
                                            <Link
                                                to="/admin"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block text-lg text-gray-700 hover:text-purple-600 font-medium"
                                            >
                                                Admin Productos
                                            </Link>
                                            <Link
                                                to="/admin-usuarios"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block text-lg text-gray-700 hover:text-purple-600 font-medium"
                                            >
                                                Admin Usuarios
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Mobile User Section */}
                                <div className="border-t pt-4 space-y-4">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-2">
                                                <p className="text-sm font-semibold">{user?.name}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Link
                                                    to="/perfil"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center text-sm text-gray-700 hover:text-purple-600"
                                                >
                                                    <UserCircle className="mr-2 h-4 w-4" />
                                                    Mi Perfil
                                                </Link>
                                                <Link
                                                    to="/carrito"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center text-sm text-gray-700 hover:text-purple-600"
                                                >
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    Carrito ({cartItemsCount})
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className="flex items-center text-sm text-red-600 hover:text-red-700 w-full"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full"
                                        >
                                            <Button variant="default" className="w-full">
                                                Iniciar Sesión
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
