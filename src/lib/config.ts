// Runtime configuration loader
export function getPocketBaseUrl(): string {
	// Check for runtime config (production)
	if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) {
		return (window as any).__APP_CONFIG__.pocketbaseUrl;
	}

	// Fallback to environment variable (development)
	return import.meta.env.PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
}
