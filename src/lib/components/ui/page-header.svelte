<script lang="ts">
	let { title, leftActions, rightActions } = $props<{
		title: string;
		leftActions?: any;
		rightActions?: any;
	}>();

	const hasLeftActions = leftActions && typeof leftActions === 'function';
	const hasRightActions = rightActions && typeof rightActions === 'function';
</script>

<header class="sticky top-0 z-50 bg-background border-b">
	<div class="flex items-center justify-between h-11 px-4">
		<div class="flex items-center gap-2">
			{#if hasLeftActions}
				{@render leftActions()}
			{/if}
		</div>

		<h1 class="text-[17px] font-semibold absolute left-1/2 -translate-x-1/2">
			{title}
		</h1>

		<div class="flex items-center gap-2">
			{#if hasRightActions}
				{@render rightActions()}
			{/if}
		</div>
	</div>
</header>
