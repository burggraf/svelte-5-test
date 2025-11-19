import { writable, type Writable } from 'svelte/store';
import { pb } from './pocketbase';
import type { RecordModel } from 'pocketbase';
import { goto } from '$app/navigation';

interface AuthState {
	user: RecordModel | null;
	isLoading: boolean;
	error: string | null;
}

function createAuthStore() {
	const { subscribe, set, update }: Writable<AuthState> = writable({
		user: pb.authStore.model,
		isLoading: false,
		error: null
	});

	// Subscribe to PocketBase auth changes
	pb.authStore.onChange((token, model) => {
		update((state) => ({ ...state, user: model, error: null }));
	});

	// Initialize: validate existing auth
	async function init() {
		if (pb.authStore.isValid) {
			try {
				// Verify token is still valid
				await pb.collection('users').authRefresh();
			} catch (err) {
				// Token expired or invalid, clear it
				pb.authStore.clear();
			}
		}
		update((state) => ({ ...state, user: pb.authStore.model }));
	}

	async function login(email: string, password: string) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const authData = await pb.collection('users').authWithPassword(email, password);
			update((state) => ({ ...state, user: authData.record, isLoading: false }));
			return authData.record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Login failed';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function register(data: {
		email: string;
		password: string;
		passwordConfirm: string;
		username?: string;
		name?: string;
	}) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const record = await pb.collection('users').create(data);
			// Auto-login after registration
			await login(data.email, data.password);
			return record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Registration failed';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function logout() {
		pb.authStore.clear();
		update((state) => ({ ...state, user: null, error: null }));
		goto('/login', { replaceState: true });
	}

	async function requestPasswordReset(email: string) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			await pb.collection('users').requestPasswordReset(email);
			update((state) => ({ ...state, isLoading: false }));
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Failed to send reset email';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function uploadAvatar(file: File) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const formData = new FormData();
			formData.append('avatar', file);

			const record = await pb.collection('users').update(pb.authStore.model?.id || '', formData);
			update((state) => ({ ...state, user: record, isLoading: false }));
			return record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Failed to upload avatar';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function updateProfile(data: { name?: string; username?: string }) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const record = await pb.collection('users').update(pb.authStore.model?.id || '', data);
			update((state) => ({ ...state, user: record, isLoading: false }));
			return record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Failed to update profile';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function removeAvatar() {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const record = await pb.collection('users').update(pb.authStore.model?.id || '', {
				avatar: null
			});
			update((state) => ({ ...state, user: record, isLoading: false }));
			return record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Failed to remove avatar';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	// Initialize on load
	init();

	return {
		subscribe,
		login,
		register,
		logout,
		requestPasswordReset,
		uploadAvatar,
		updateProfile,
		removeAvatar
	};
}

export const auth = createAuthStore();
