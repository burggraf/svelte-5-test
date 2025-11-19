import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/stores/pocketbase';

export const ssr = false;

export async function load() {
	// Redirect to dashboard if already authenticated
	if (pb.authStore.isValid) {
		throw redirect(303, '/');
	}
	return {};
}
