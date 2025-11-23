import React from 'react';

interface CardsIconProps {
    className?: string;
}

export const CardsIcon: React.FC<CardsIconProps> = ({ className = "h-6 w-6" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Carta principal */}
            <rect x="3" y="6" width="14" height="10" rx="2" />
            {/* Carta superpuesta */}
            <rect x="7" y="4" width="14" height="10" rx="2" />
            {/* Líneas internas (opcional) */}
            <line x1="6" y1="10" x2="10" y2="10" />
            <line x1="6" y1="13" x2="12" y2="13" />
        </svg>
    );
};