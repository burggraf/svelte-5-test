// Runtime configuration loader
export function getPocketBaseUrl(): string {
	// Only runs in browser
	if (typeof window !== 'undefined') {
		const protocol = window.location.protocol;
		const hostname = window.location.hostname;

		// HTTP = local development
		if (protocol === 'http:') {
			return 'http://localhost:8090';
		}

		// HTTPS = production (use current domain)
		if (protocol === 'https:') {
			return `https://${hostname}`;
		}
	}

	// SSR fallback (should not be used since ssr = false)
	return 'http://localhost:8090';
}
