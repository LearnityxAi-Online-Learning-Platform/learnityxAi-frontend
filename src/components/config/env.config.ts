// src/config/env.config.ts

/**
 * Environment Configuration
 * Centralized configuration for all environment variables
 */

interface EnvironmentConfig {
    baseUrlAuth: string;
    keycloakBaseUrl: string;
    keycloakRealm: string;
    keycloakClientId: string;
    isDevelopment: boolean;
    isProduction: boolean;
    apiTimeout: number;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
    const baseUrlAuth = process.env.NEXT_PUBLIC_BASE_URL || 'https://api-auth.deliverex.com.au';
    const keycloakBaseUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://keycloak.deliverex.com.au';

    return {
        baseUrlAuth,
        keycloakBaseUrl,
        keycloakRealm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'deliverex',
        keycloakClientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'deliverex-frontend',
        isDevelopment: process.env.NODE_ENV === 'development',
        isProduction: process.env.NODE_ENV === 'production',
        apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000, // 30 seconds
    };
};

export const ENV_CONFIG = getEnvironmentConfig();

// Export individual URLs for convenience
export const BASE_URL_AUTH = ENV_CONFIG.baseUrlAuth;
export const KEYCLOAK_BASE_URL = ENV_CONFIG.keycloakBaseUrl;
export const KEYCLOAK_REALM = ENV_CONFIG.keycloakRealm;
export const KEYCLOAK_CLIENT_ID = ENV_CONFIG.keycloakClientId;