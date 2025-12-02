import React, { useState } from 'react';
import { ImageUtils } from '@/utils/imageUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOff } from 'lucide-react';

interface ProductImageProps {
    src?: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    loading?: 'lazy' | 'eager';
    showErrorState?: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({
    src,
    alt,
    className = '',
    fallbackSrc,
    objectFit = 'cover',
    loading = 'lazy',
    showErrorState = true
}) => {
    const [imgSrc, setImgSrc] = useState<string>(() => {
        if (!src || !ImageUtils.isValidImageUrl(src)) {
            return fallbackSrc || ImageUtils.getDefaultImage();
        }
        return src;
    });
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc || ImageUtils.getDefaultImage());
            setIsLoading(false);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    // Si está cargando y no es la imagen por defecto
    if (isLoading && imgSrc !== ImageUtils.getDefaultImage()) {
        return (
            <div className={`relative ${className}`}>
                <Skeleton className="w-full h-full rounded" />
            </div>
        );
    }

    // Si hay error y mostramos estado de error
    if (hasError && showErrorState && imgSrc === ImageUtils.getDefaultImage()) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gray-100 rounded ${className}`}>
                <ImageOff className="h-8 w-8 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 text-center px-1">
                    {alt || 'Imagen'}
                </span>
            </div>
        );
    }

    // Renderizar imagen normal
    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`${className} object-${objectFit} ${hasError ? 'opacity-80' : ''}`}
            onError={handleError}
            onLoad={handleLoad}
            loading={loading}
        />
    );
};

export default ProductImage;