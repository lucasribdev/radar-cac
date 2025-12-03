import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import { formatDays, formatNumber } from "@/lib/format";
import type { PeriodValue } from "@/routes";
import { fetchSubmissionStats } from "@/services/submissions";
import type { ProcessTypeEnum } from "@/types/enums";
import { StatCard } from "./StatCard";

interface ProcessStatsProps {
	processType: ProcessTypeEnum | "Todos";
	om: string | "Todas";
	period: PeriodValue;
}

const periodToDays: Record<PeriodValue, number> = {
	"7d": 7,
	"30d": 30,
	"90d": 90,
	"12m": 365,
};

export const ProcessStats = ({
	processType,
	om,
	period,
}: ProcessStatsProps) => {
	const {
		data: aggregatedStats = {
			total: 0,
			avgDays: null,
			minDays: null,
			maxDays: null,
		},
		isFetching: isLoadingStats,
	} = useQuery({
		queryKey: ["submissions-stats", processType, om, period],
		queryFn: () =>
			fetchSubmissionStats({
				processType,
				om,
				days: periodToDays[period],
			}),
	});

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<StatCard
				title="Média de Dias"
				value={isLoadingStats ? "..." : formatDays(aggregatedStats.avgDays)}
				icon={Calendar}
				description="Tempo médio de deferimento no período"
			/>
			<StatCard
				title="Menor Prazo"
				value={isLoadingStats ? "..." : formatDays(aggregatedStats.minDays)}
				icon={TrendingUp}
				description="Menor prazo registrado"
			/>
			<StatCard
				title="Total de Envios"
				value={
					isLoadingStats ? "..." : formatNumber(aggregatedStats.total ?? 0)
				}
				icon={FileText}
				description="Processos registrados no filtro"
			/>
		</div>
	);
};
