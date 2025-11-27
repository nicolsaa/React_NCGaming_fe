import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Share2,
    Star,
    StarHalf,
    Truck,
    Shield,
    RotateCcw,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { products } = useProducts();

    const selectedImage = 0;
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    const product = products.find(p => p.id === id);

    const productImages = [
        product?.image || '/images/placeholder.jpg',
    ];

    const shippingInfo = {
        freeShipping: true,
        deliveryTime: '2-4 días',
        returnPolicy: '30 días'
    };

    const reviews = {
        average: 4.5,
        total: 128,
        stars: [5, 4, 3, 2, 1]
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
                <p className="text-gray-600 mb-8">El producto que buscas no existe o ha sido removido.</p>
                <Button onClick={() => navigate('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                </Button>
            </div>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }

        return stars;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                <Link to="/" className="hover:text-purple-600 transition-colors">Inicio</Link>
                <ChevronRight className="h-4 w-4" />
                <Link
                    to={`/catalogo-${product.category}`}
                    className="hover:text-purple-600 transition-colors capitalize"
                >
                    {product.category}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium truncate">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Galería de imágenes */}
                <div className="space-y-4">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <img
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Información del producto */}
                <div className="space-y-6">
                    <Badge variant="secondary" className="mb-3 capitalize">
                        {product.category}
                    </Badge>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center space-x-1">
                            {renderStars(reviews.average)}
                        </div>
                        <span className="text-sm text-gray-600">
                            {reviews.average} ({reviews.total} reseñas)
                        </span>
                    </div>

                    {/* Precio */}
                    <div className="flex items-baseline space-x-2 mb-4">
                        <span className="text-3xl font-bold text-purple-600">
                            {new Intl.NumberFormat('es-CL', {
                                style: 'currency',
                                currency: 'CLP',
                                minimumFractionDigits: 0
                            }).format(product.price)}
                        </span>
                        {product.price > 50000 && (
                            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                ¡Envío gratis!
                            </span>
                        )}
                    </div>

                    <Separator />

                    {/* Descripción */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant={product.stock > 0 ? "default" : "destructive"}
                            className={product.stock > 0 ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                        >
                            {product.stock > 0 ? `En stock (${product.stock})` : 'Agotado'}
                        </Badge>
                        {product.stock < 10 && product.stock > 0 && (
                            <span className="text-sm text-orange-600">¡Últimas unidades!</span>
                        )}
                    </div>

                    {/* Cantidad y Acciones */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">Cantidad:</span>
                            <div className="flex items-center border rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Agregar al Carrito
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`flex-shrink-0 ${isFavorite ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                            >
                                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </Button>

                            <Button variant="outline" size="icon" className="flex-shrink-0">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Información de envío */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center space-x-3">
                                <Truck className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Envío gratis</p>
                                    <p className="text-sm text-gray-600">Recíbelo en {shippingInfo.deliveryTime}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <RotateCcw className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Devolución gratis</p>
                                    <p className="text-sm text-gray-600">{shippingInfo.returnPolicy} para devoluciones</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Shield className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-medium">Garantía</p>
                                    <p className="text-sm text-gray-600">Garantía del fabricante incluida</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Reseñas */}
            <section>
                <h2 className="text-2xl font-bold mb-8">Reseñas de Clientes</h2>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-shrink-0">
                                <div className="text-center mb-4">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">{reviews.average}</div>
                                    <div className="flex justify-center mb-2">
                                        {renderStars(reviews.average)}
                                    </div>
                                    <div className="text-sm text-gray-600">{reviews.total} reseñas</div>
                                </div>

                                <div className="space-y-2">
                                    {reviews.stars.map((star, index) => (
                                        <div key={star} className="flex items-center space-x-2 text-sm">
                                            <span>{star}</span>
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{ width: `${(5 - index) * 20}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="space-y-4">
                                    <div className="border-b pb-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="flex items-center space-x-1">
                                                {renderStars(5)}
                                            </div>
                                            <span className="font-medium">Juan Pérez</span>
                                        </div>
                                        <p className="text-gray-700 mb-2">
                                            ¡Excelente producto! La calidad superó mis expectativas.
                                            El envío fue rápido y el empaque perfecto.
                                        </p>
                                        <span className="text-sm text-gray-500">Hace 2 días</span>
                                    </div>
                                </div>

                                <Button variant="outline" className="mt-4">
                                    Ver todas las reseñas
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default ProductDetail;
