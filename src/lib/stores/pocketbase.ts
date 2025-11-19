import PocketBase from 'pocketbase';
import { getPocketBaseUrl } from '$lib/config';

// Singleton instance
export const pb = new PocketBase(getPocketBaseUrl());

// Enable auto-cancellation for request deduplication
pb.autoCancellation(false);
