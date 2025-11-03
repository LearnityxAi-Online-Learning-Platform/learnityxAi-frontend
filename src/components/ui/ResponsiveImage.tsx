// src/components/ui/ResponsiveImage.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ResponsiveImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
}

export default function ResponsiveImage({
    src,
    alt,
    className = "",
    fallbackSrc = "/placeholder.jpg"
}: ResponsiveImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        if (imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setIsLoading(true);
        }
    };

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded-lg">
                    <div className="text-4xl">⏳</div>
                </div>
            )}
            <Image
                src={imageSrc}
                alt={alt}
                fill
                className="object-cover rounded-lg"
                onError={handleError}
                onLoad={() => setIsLoading(false)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
}