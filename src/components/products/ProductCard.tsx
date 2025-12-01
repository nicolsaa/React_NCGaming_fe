import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
                {/* Imagen del producto */}
                <Link to={`/producto/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                <div className="p-4">
                    {/* Categoría */}
                    <Badge variant="secondary" className="mb-2 capitalize">
                        {product.category}
                    </Badge>

                    {/* Nombre del producto */}
                    <Link to={`/producto/${product.id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-purple-600 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Descripción */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                    </p>

                    {/* Precio y stock */}
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xl font-bold text-purple-600">
                            ${product.price.toLocaleString('es-CL')}
                        </span>
                        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">
                {/* Botón Ver Detalles */}
                <Link to={`/producto/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                        Ver Detalles
                    </Button>
                </Link>

                {/* Botón Agregar al Carrito */}
                <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                    Agregar
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
