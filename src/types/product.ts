export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    stock: number;
    featured?: boolean;
    rating?: number;
    sizes?: string[];
}

export interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
}

export interface ShippingInfo {
    freeShipping: boolean;
    deliveryTime: string;
    returnPolicy: string;
}