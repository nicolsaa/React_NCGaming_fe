// src/hooks/useImageLoader.ts
import { useState, useEffect } from 'react';
import { ImageUtils } from '@/utils/imageUtils';

export const useImageLoader = (src?: string) => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Si no hay src, usar imagen por defecto
        if (!src || !ImageUtils.isValidImageUrl(src)) {
            setImageSrc(ImageUtils.getDefaultImage());
            setLoading(false);
            setError(true);
            return;
        }

        const img = new Image();
        let mounted = true;
        
        const handleLoad = () => {
            if (mounted) {
                setImageSrc(src);
                setLoading(false);
                setError(false);
            }
        };
        
        const handleError = () => {
            if (mounted) {
                setImageSrc(ImageUtils.getDefaultImage());
                setLoading(false);
                setError(true);
            }
        };
        
        img.onload = handleLoad;
        img.onerror = handleError;
        img.src = src;
        
        return () => {
            mounted = false;
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    return { imageSrc, loading, error };
};