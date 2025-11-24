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
