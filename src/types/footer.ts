export interface SocialLink {
    href: string;
    icon: string;
    label: string;
}

export interface ProductLink {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}