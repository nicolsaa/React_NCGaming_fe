export const IMAGE_PATHS = {
    DEFAULT_PRODUCT: 'src/assets/images/Logo-sin-Fondo.png',
    LOGO: 'src/assets/images/logo.png',
    PLACEHOLDER: 'src/images/placeholder.jpg',
    
    // Rutas absolutas para desarrollo y producción
    getDefaultProduct() {
        // Detect development in front-end (Vite)
        let isDev = false;
        if (typeof import.meta !== 'undefined') {
            const env = (import.meta as any).env;
            if (env && typeof env.DEV !== 'undefined') {
                isDev = !!env.DEV;
            }
        }
        if (isDev) {
            return `${window.location.origin}${this.DEFAULT_PRODUCT}`;
        }
        return this.DEFAULT_PRODUCT;
    }
};

// Verificar si las imágenes existen
export const checkImageExists = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};
