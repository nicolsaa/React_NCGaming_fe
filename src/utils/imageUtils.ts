export class ImageUtils {
    // Obtener imagen por defecto
    static getDefaultImage(): string {

        return 'src/assets/images/Logo_sin_Fondo.png';
    }

    // Validar si una URL de imagen es válida
    static isValidImageUrl(url?: string): boolean {
        if (!url) return false;
        
        const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const lowerUrl = url.toLowerCase();
        
        const isValidFormat = imageFormats.some(format => 
            lowerUrl.includes(format) || 
            lowerUrl.startsWith('data:image') || 
            lowerUrl.startsWith('blob:')
        );
        
        const isHttpUrl = lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://');
        const isAbsolutePath = lowerUrl.startsWith('/');
        
        return isValidFormat || isHttpUrl || isAbsolutePath;
    }
}