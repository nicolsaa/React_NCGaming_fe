// src/pages/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { productService } from '@/services/productService';
import type { Product } from '@/types';
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
    ChevronRight,
    Loader2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';


const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [addingToCart, setAddingToCart] = useState(false);

    // Galería de imágenes (podría venir del backend en el futuro)
    const [productImages, setProductImages] = useState<string[]>([
        '/assets/images/Logo_sin_Fondo.png'
    ]);

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

    // Cargar producto del backend
    useEffect(() => {
        const loadProduct = async () => {
            if (!id) {
                setError('ID de producto no válido');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const productData = await productService.getProductById(id);
                setProduct(productData);
                
                // Configurar imágenes
                if (productData.image) {
                    setProductImages([productData.image]);
                }
                
                // Configurar tamaño por defecto si hay tallas
                if (productData.sizes && productData.sizes.length > 0) {
                    setSelectedSize(productData.sizes[0]);
                }
                
            } catch (error: any) {
                console.error('Error cargando producto:', error);
                setError(error.message || 'Error al cargar el producto');
                
                // Intentar cargar del localStorage como fallback
                try {
                    const adminProducts = localStorage.getItem('admin_products');
                    if (adminProducts) {
                        const products: Product[] = JSON.parse(adminProducts);
                        const foundProduct = products.find(p => p.id === id);
                        if (foundProduct) {
                            setProduct(foundProduct);
                            if (foundProduct.image) {
                                setProductImages([foundProduct.image]);
                            }
                            setError(null);
                        }
                    }
                } catch (localError) {
                    console.error('Error loading from localStorage:', localError);
                }
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
        window.scrollTo(0, 0);
    }, [id]);

    // Si el producto tiene tallas, preseleccionar la primera al cargar
    useEffect(() => {
        if (product?.sizes && product.sizes.length > 0 && selectedSize === '') {
            setSelectedSize(product.sizes[0]);
        }
    }, [product?.sizes]);

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            setAddingToCart(true);
            setError(null);
            
            await addToCart(product, selectedSize || undefined);
            
            setSuccess('Producto agregado al carrito');
            setTimeout(() => setSuccess(null), 3000);
            
            // Resetear cantidad
            setQuantity(1);
            
        } catch (error: any) {
            console.error('Error agregando al carrito:', error);
            setError(error.message || 'Error al agregar al carrito');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share && product) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback para copiar enlace
            navigator.clipboard.writeText(window.location.href);
            setSuccess('Enlace copiado al portapapeles');
            setTimeout(() => setSuccess(null), 2000);
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

    // Estado de carga
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb skeleton */}
                <div className="flex items-center space-x-2 mb-8">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Imagen skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="w-full h-96 rounded-lg" />
                    </div>

                    {/* Información skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-8 w-3/4" />
                        
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-24" />
                        </div>

                        <Skeleton className="h-10 w-32" />

                        <Separator />

                        <div>
                            <Skeleton className="h-6 w-32 mb-3" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-2" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>

                        <Skeleton className="h-8 w-28" />

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-10 w-32" />
                            </div>

                            <div className="flex gap-4">
                                <Skeleton className="h-12 flex-1" />
                                <Skeleton className="h-12 w-12" />
                                <Skeleton className="h-12 w-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error o producto no encontrado
    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Alert variant="destructive" className="mb-8 max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error || 'Producto no encontrado'}
                    </AlertDescription>
                </Alert>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
                <p className="text-gray-600 mb-8">
                    El producto que buscas no existe o ha sido removido.
                </p>
                <Button onClick={() => navigate('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Notificaciones */}
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {success && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                <Link 
                    to="/" 
                    className="hover:text-purple-600 transition-colors hover:underline"
                >
                    Inicio
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link
                    to={`/catalogo-${product.category}`}
                    className="hover:text-purple-600 transition-colors hover:underline capitalize"
                >
                    {product.category}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium truncate max-w-xs">
                    {product.name}
                </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Galería de imágenes */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-2">
                        <CardContent className="p-0">
                            <img
                                src={productImages[selectedImage] || '/assets/images/Logo-sin-Fondo.png'}
                                alt={product.name}
                                className="w-full h-96 object-contain bg-white hover:scale-105 transition-transform duration-300 p-4"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/assets/images/Logo-sin-Fondo.png';
                                }}
                            />
                        </CardContent>
                    </Card>
                    
                    {/* Miniaturas (si hay más de una imagen) */}
                    {productImages.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto py-2">
                            {productImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                                        selectedImage === index 
                                            ? 'border-purple-500 ring-2 ring-purple-200' 
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Vista ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/assets/images/Logo-sin-Fondo.png';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="space-y-6">
                    <Badge 
                        variant="secondary" 
                        className="mb-3 capitalize text-sm font-semibold"
                    >
                        {product.category}
                    </Badge>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                    </h1>

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
                            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                                ¡Envío gratis!
                            </span>
                        )}
                        {product.featured && (
                            <span className="text-sm text-pink-600 bg-pink-50 px-2 py-1 rounded-full font-medium">
                                ⭐ Destacado
                            </span>
                        )}
                    </div>

                    {/* Tallas (si aplica) */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Talla
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                                            selectedSize === size
                                                ? 'bg-purple-600 text-white border-purple-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Descripción */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900">
                            Descripción
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {product.description || 'Sin descripción disponible.'}
                        </p>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center space-x-4">
                        <Badge
                            variant={product.stock > 0 ? "default" : "destructive"}
                            className={`text-sm font-medium ${
                                product.stock > 0 
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" 
                                    : ""
                            }`}
                        >
                            {product.stock > 0 ? `En stock (${product.stock})` : 'Agotado'}
                        </Badge>
                        
                        {product.stock < 10 && product.stock > 0 && (
                            <span className="text-sm text-orange-600 font-medium flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                ¡Últimas unidades!
                            </span>
                        )}
                        
                        {product.stock > 20 && (
                            <span className="text-sm text-green-600 font-medium">
                                ✓ Amplia disponibilidad
                            </span>
                        )}
                    </div>

                    {/* Cantidad y Acciones */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-700">Cantidad:</span>
                            <div className="flex items-center border rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1 || product.stock === 0}
                                    className="h-10 w-10"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium text-gray-900">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock || product.stock === 0}
                                    className="h-10 w-10"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <span className="text-sm text-gray-500">
                                Máximo: {product.stock} unidades
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addingToCart}
                            >
                                {addingToCart ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                )}
                                {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`h-12 w-12 ${
                                    isFavorite 
                                        ? 'bg-red-50 border-red-200 text-red-600' 
                                        : ''
                                }`}
                            >
                                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </Button>

                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-12 w-12"
                                onClick={handleShare}
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        {product.stock > 0 && (
                            <p className="text-sm text-gray-500">
                                Subtotal: {new Intl.NumberFormat('es-CL', {
                                    style: 'currency',
                                    currency: 'CLP',
                                    minimumFractionDigits: 0
                                }).format(product.price * quantity)}
                            </p>
                        )}
                    </div>

                    {/* Información de envío */}
                    <Card className="bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Información de envío
                            </h3>
                            
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Truck className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {shippingInfo.freeShipping ? 'Envío gratis' : 'Envío con costo'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Recíbelo en {shippingInfo.deliveryTime}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <RotateCcw className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Devolución fácil</p>
                                    <p className="text-sm text-gray-600">
                                        {shippingInfo.returnPolicy} para devoluciones
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <Shield className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Compra segura</p>
                                    <p className="text-sm text-gray-600">
                                        Pago seguro y garantía incluida
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Reseñas */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Reseñas de Clientes
                </h2>
                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-shrink-0">
                                <div className="text-center mb-4">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        {reviews.average}
                                    </div>
                                    <div className="flex justify-center mb-2">
                                        {renderStars(reviews.average)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Basado en {reviews.total} reseñas
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {reviews.stars.map((star, index) => (
                                        <div key={star} className="flex items-center space-x-2 text-sm">
                                            <span className="w-4 text-gray-600">{star}</span>
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
                                            <span className="font-medium text-gray-900">Juan Pérez</span>
                                            <span className="text-xs text-gray-500">• Cliente verificado</span>
                                        </div>
                                        <p className="text-gray-700 mb-2">
                                            ¡Excelente producto! La calidad superó mis expectativas.
                                            El envío fue rápido y el empaque perfecto.
                                        </p>
                                        <span className="text-sm text-gray-500">Hace 2 días • Compra verificada</span>
                                    </div>
                                    
                                    <div className="border-b pb-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="flex items-center space-x-1">
                                                {renderStars(4)}
                                            </div>
                                            <span className="font-medium text-gray-900">María González</span>
                                        </div>
                                        <p className="text-gray-700 mb-2">
                                            Muy buena relación calidad-precio. El producto llegó en perfecto estado.
                                            Volvería a comprar sin duda.
                                        </p>
                                        <span className="text-sm text-gray-500">Hace 1 semana</span>
                                    </div>
                                </div>

                                <Button variant="outline" className="mt-6">
                                    Ver todas las reseñas ({reviews.total})
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Productos relacionados (si hay tiempo implementar) */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Productos relacionados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="text-center py-8 text-gray-500">
                        <p className="mb-4">Aquí aparecerán productos similares</p>
                        <Button variant="outline" onClick={() => navigate(`/catalogo-${product.category}`)}>
                            Ver más en {product.category}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;