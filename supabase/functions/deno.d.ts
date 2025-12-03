// Ambient Deno types for Supabase Edge Functions runtime
declare const Deno: {
	env: {
		get(key: string): string | undefined;
	};
};
