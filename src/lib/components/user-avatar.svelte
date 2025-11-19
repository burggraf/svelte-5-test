<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { pb } from '$lib/stores/pocketbase';
	import type { RecordModel } from 'pocketbase';

	let { user, size = 'md' }: { user: RecordModel | null; size?: 'sm' | 'md' | 'lg' } = $props();

	const sizeClasses = {
		sm: 'h-8 w-8 text-sm',
		md: 'h-10 w-10 text-base',
		lg: 'h-16 w-16 text-2xl'
	};

	function getAvatarUrl(user: RecordModel | null): string | null {
		if (!user?.avatar) return null;
		return pb.files.getUrl(user, user.avatar, { thumb: '100x100' });
	}

	function getInitials(user: RecordModel | null): string {
		if (!user) return '?';

		if (user.name) {
			const parts = user.name.split(' ');
			if (parts.length >= 2) {
				return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
			}
			return user.name.substring(0, 2).toUpperCase();
		}

		if (user.username) {
			return user.username.substring(0, 2).toUpperCase();
		}

		if (user.email) {
			return user.email.substring(0, 2).toUpperCase();
		}

		return '?';
	}

	function getBackgroundColor(user: RecordModel | null): string {
		if (!user?.email) return 'bg-gray-500';

		// Generate consistent color from email hash
		let hash = 0;
		for (let i = 0; i < user.email.length; i++) {
			hash = user.email.charCodeAt(i) + ((hash << 5) - hash);
		}

		const colors = [
			'bg-blue-500',
			'bg-green-500',
			'bg-yellow-500',
			'bg-purple-500',
			'bg-pink-500',
			'bg-indigo-500',
			'bg-red-500',
			'bg-orange-500'
		];

		return colors[Math.abs(hash) % colors.length];
	}

	let avatarUrl = $derived(getAvatarUrl(user));
	let initials = $derived(getInitials(user));
	let bgColor = $derived(getBackgroundColor(user));
</script>

<Avatar.Root class={sizeClasses[size]}>
	{#if avatarUrl}
		<Avatar.Image src={avatarUrl} alt={user?.name || user?.username || 'User avatar'} />
	{/if}
	<Avatar.Fallback class={`${bgColor} text-white`}>
		{initials}
	</Avatar.Fallback>
</Avatar.Root>
