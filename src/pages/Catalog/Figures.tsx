import React from 'react';
import { useProducts } from '@/context/ProductsContext';
import ProductGrid from '@/components/products/ProductGrid';
import { Badge } from '@/components/ui/badge';
import {
    Gift
} from 'lucide-react';

const Figures: React.FC = () => {
    const { getProductsByCategory, loading } = useProducts();
    const figures = getProductsByCategory('figuras');

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
                    <div className="mb-8">
                        <Badge variant="outline" className="mb-4 text-sm">Figuras Coleccionables</Badge>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Figuras de Colección</h1>
                        <p className="text-gray-600 max-w-2xl">
                            Descubre figuras de tus personajes favoritos. Encuentra figuras de colección, Pop! vinyl, model kits y ediciones especiales para tu colección.
                        </p>
                    </div>

            {/* Todas las Figuras */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5 text-purple-600" />
                        <h2 className="text-2xl font-semibold">Todas las Figuras</h2>
                    </div>
                    <Badge variant="secondary">
                        {figures.length} productos
                    </Badge>
                </div>

                <ProductGrid products={figures} loading={loading} />
            </div>
        </div>
    );
};

export default Figures;
