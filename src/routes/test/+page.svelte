<script lang="ts">
	let count = 0;

	function increment() {
		count++;
		console.log('Button clicked! Count:', count);
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<div class="space-y-4 text-center">
		<h1 class="text-2xl font-bold">Button Test Page</h1>
		<p>Count: {count}</p>

		<button
			onclick={increment}
			class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
		>
			Native Button - Click Me
		</button>

		<div>
			<a href="/login" class="text-blue-600 hover:underline">
				Go to Login
			</a>
		</div>
	</div>
</div>
