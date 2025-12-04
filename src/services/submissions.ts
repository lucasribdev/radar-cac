import { supabaseClient } from "@/lib/supabaseClient";
import type { OmEnum, ProcessTypeEnum } from "@/types/enums";

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
	om: OmEnum | "";
	processType: ProcessTypeEnum | "";
	result: string;
	avgDays: number | null;
};

export async function fetchSubmissionStats({
	processType,
	om,
	days,
}: {
	processType?: ProcessTypeEnum;
	om?: OmEnum;
	days: number;
}): Promise<AggregatedStats> {
	const { data, error } = await supabaseClient.rpc("get_submissions_stats", {
		p_om: om ?? null,
		p_period_to_days: days,
		p_process_type: processType ?? null,
	});

	if (error) {
		throw error;
	}

	return data?.[0];
}

export async function fetchMonthlyStats({
	processType,
	om,
}: {
	processType?: ProcessTypeEnum;
	om?: OmEnum;
}): Promise<MonthlyStat[]> {
	const { data, error } = await supabaseClient.rpc(
		"get_submissions_monthly_stats",
		{
			p_om: om ?? null,
			p_process_type: processType ?? null,
		},
	);

	if (error) {
		throw error;
	}

	return data ?? [];
}

export async function fetchRecentSubmissions({
	processType,
	om,
	limit = 6,
}: {
	processType?: ProcessTypeEnum;
	om?: OmEnum;
	limit?: number;
} = {}): Promise<RecentSubmission[]> {
	const { data, error } = await supabaseClient.rpc("get_recent_submissions", {
		p_om: om ?? null,
		p_process_type: processType ?? null,
		p_limit: limit,
	});

	if (error) {
		throw error;
	}

	return (data ?? []) as RecentSubmission[];
}
