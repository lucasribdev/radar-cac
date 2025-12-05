import { supabaseClient } from "@/lib/supabaseClient";
import type { TypeEnum } from "@/types/enums";

export type AggregatedStats = {
	total: number;
	avgDays: number | null;
	minDays: number | null;
	maxDays: number | null;
};

export type MonthlyStat = {
	month: string;
	avgDays: number | null;
};

export type RecentSubmission = {
	id: string;
	createdAt: string;
	om: string | null;
	omId: number | null;
	type: TypeEnum | "";
	result: string;
	avgDays: number | null;
};

export async function fetchSubmissionStats({
	type,
	omId,
	days,
}: {
	type?: TypeEnum;
	omId?: number;
	days: number;
}): Promise<AggregatedStats> {
	const { data, error } = await supabaseClient.rpc("get_submissions_stats", {
		p_om_id: omId ?? null,
		p_period_to_days: days,
		p_type: type ?? null,
	});

	if (error) {
		throw error;
	}

	return data?.[0];
}

export async function fetchMonthlyStats({
	type,
	omId,
}: {
	type?: TypeEnum;
	omId?: number;
}): Promise<MonthlyStat[]> {
	const { data, error } = await supabaseClient.rpc(
		"get_submissions_monthly_stats",
		{
			p_om_id: omId ?? null,
			p_type: type ?? null,
		},
	);

	if (error) {
		throw error;
	}

	return data ?? [];
}

export async function fetchRecentSubmissions({
	type,
	omId,
	limit = 6,
}: {
	type?: TypeEnum;
	omId?: number;
	limit?: number;
} = {}): Promise<RecentSubmission[]> {
	const { data, error } = await supabaseClient.rpc("get_recent_submissions", {
		p_om_id: omId ?? null,
		p_type: type ?? null,
		p_limit: limit,
	});

	if (error) {
		throw error;
	}

	return (data ?? []).map((item) => {
		const omIdValue =
			(item as { omId?: number | null }).omId ??
			(item as { om_id?: number | null }).om_id ??
			null;

		return {
			id: (item as { id: string }).id,
			createdAt:
				(item as { createdAt?: string }).createdAt ??
				(item as { created_at?: string }).created_at ??
				"",
			om:
				(item as { om?: string | null }).om ??
				(item as { om_unit?: string | null }).om_unit ??
				(item as { om_unit_name?: string | null }).om_unit_name ??
				null,
			omId: omIdValue,
			type: (item as { type?: TypeEnum | "" }).type ?? "",
			result: (item as { result?: string }).result ?? "",
			avgDays:
				(item as { avgDays?: number | null }).avgDays ??
				(item as { days?: number | null }).days ??
				null,
		};
	}) as RecentSubmission[];
}
