import { supabaseClient } from "@/lib/supabaseClient";
import type { Om } from "@/types/oms";

export async function fetchOms(): Promise<Om[]> {
	const { data, error } = await supabaseClient
		.from("oms")
		.select("id, unit, email")
		.order("unit", { ascending: true });

	if (error) {
		throw error;
	}

	console.log(data);

	return data ?? [];
}
