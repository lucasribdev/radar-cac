import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { supabaseClient } from "@/lib/supabaseClient";
import { PROCESS_TYPE_ENUM, type ProcessTypeEnum } from "@/types/enums";

export const Route = createFileRoute("/")({ component: App });

const processTypeLabels: Record<ProcessTypeEnum, string> = {
	CR: "CR",
	AUTORIZACAO_COMPRA: "Autorização de Compra",
	CRAF: "CRAF",
	GUIA_TRAFEGO: "Guia de Tráfego",
};

const tiposProcesso = [
	{ value: "Todos", label: "Todos" },
	...PROCESS_TYPE_ENUM.map((value) => ({
		value,
		label: processTypeLabels[value],
	})),
] as const;

type TipoProcessoValue = (typeof tiposProcesso)[number]["value"];

const periodos = [
	{ value: "7d", label: "Últimos 7 dias" },
	{ value: "30d", label: "Últimos 30 dias" },
	{ value: "90d", label: "Últimos 90 dias" },
	{ value: "12m", label: "Últimos 12 meses" },
] as const;

type PeriodoValue = (typeof periodos)[number]["value"];

async function fetchOms() {
	const { data, error } = await supabaseClient
		.from("submissions")
		.select("om_name");

	if (error) {
		throw error;
	}

	const uniqueOms = Array.from(
		new Set((data ?? []).map((item) => item.om_name)),
	);
	uniqueOms.sort((a, b) => a.localeCompare(b));
	return uniqueOms;
}

type AggregatedStats = {
	total: number;
	avgDays: number | null;
	minDays: number | null;
	maxDays: number | null;
};

type MonthlyStat = {
	month: string;
	avgDays: number | null;
};

type RecentSubmission = {
	omName: string;
	processType: ProcessTypeEnum;
	result: string;
	avgDays: number | null;
};

const periodToDays: Record<PeriodoValue, number> = {
	"7d": 7,
	"30d": 30,
	"90d": 90,
	"12m": 365,
};

async function fetchSubmissionStats({
	processType,
	om,
	periodo,
}: {
	processType: TipoProcessoValue;
	om: string;
	periodo: PeriodoValue;
}): Promise<AggregatedStats> {
	const { data, error } = await supabaseClient.rpc("get_submissions_stats", {
		p_om_name: om === "Todas" ? null : om,
		p_period_to_days: periodToDays[periodo],
		p_process_type: processType === "Todos" ? null : processType,
	});

	if (error) {
		throw error;
	}

	const stats = data?.[0];
	return {
		total: stats?.total ?? 0,
		avgDays: stats?.avgDays ?? null,
		minDays: stats?.minDays ?? null,
		maxDays: stats?.maxDays ?? null,
	};
}

async function fetchMonthlyStats({
	processType,
	om,
}: {
	processType: TipoProcessoValue;
	om: string;
}): Promise<MonthlyStat[]> {
	const { data, error } = await supabaseClient.rpc(
		"get_submissions_monthly_stats",
		{
			p_om_name: om === "Todas" ? null : om,
			p_process_type: processType === "Todos" ? null : processType,
		},
	);

	if (error) {
		throw error;
	}

	return data ?? [];
}

async function fetchRecentSubmissions({
	processType,
	om,
	limit = 6,
}: {
	processType: TipoProcessoValue;
	om: string;
	limit?: number;
}): Promise<RecentSubmission[]> {
	const { data, error } = await supabaseClient.rpc("get_recent_submissions", {
		p_om_name: om === "Todas" ? null : om,
		p_process_type: processType === "Todos" ? null : processType,
		p_limit: limit,
	});

	if (error) {
		throw error;
	}

	return (data ?? []) as RecentSubmission[];
}

function formatDays(value: number | null) {
	if (value === null || Number.isNaN(value)) return "--";
	return `${Math.round(value)} dias`;
}

function formatNumber(value: number) {
	return value.toLocaleString("pt-BR");
}

function App() {
	const [tipoProcesso, setTipoProcesso] = useState<TipoProcessoValue>("Todos");
	const [om, setOm] = useState("Todas");
	const [periodo, setPeriodo] = useState<PeriodoValue>("90d");
	const {
		data: omsPoliciaFederal = [],
		isFetching: isLoadingOms,
		error: omsError,
	} = useQuery({
		queryKey: ["oms-policia-federal"],
		queryFn: fetchOms,
	});
	const {
		data: aggregatedStats = {
			total: 0,
			avgDays: null,
			minDays: null,
			maxDays: null,
		},
		isFetching: isLoadingStats,
		error: statsError,
	} = useQuery({
		queryKey: ["submissions-stats", tipoProcesso, om, periodo],
		queryFn: () =>
			fetchSubmissionStats({ processType: tipoProcesso, om, periodo }),
	});
	const { data: monthlyStats = [] } = useQuery({
		queryKey: ["submissions-monthly-stats", tipoProcesso, om],
		queryFn: () => fetchMonthlyStats({ processType: tipoProcesso, om }),
	});
	const { data: recentSubmissions = [] } = useQuery({
		queryKey: ["recent-submissions", tipoProcesso, om],
		queryFn: () => fetchRecentSubmissions({ processType: tipoProcesso, om }),
	});

	const chartData = monthlyStats.map((row) => ({
		mes: row.month,
		dias: row.avgDays ?? 0,
	}));

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-foreground mb-2">Visão geral</h1>
				<p className="text-muted-foreground">
					Painel comunitário para acompanhar prazos informados pelos usuários.
				</p>
			</div>

			{/* Filtros */}
			<Card>
				<CardContent className="pt-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium text-foreground">
								Tipo de Processo
							</Label>
							<Select
								value={tipoProcesso}
								onValueChange={(value) =>
									setTipoProcesso(value as TipoProcessoValue)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{tiposProcesso.map((tipo) => (
										<SelectItem key={tipo.value} value={tipo.value}>
											{tipo.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium text-foreground">
								OM da Polícia Federal
							</Label>
							<Select
								value={om}
								disabled={isLoadingOms || !!omsError}
								onValueChange={setOm}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecione a OM" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Todas">Todas</SelectItem>
									{omsPoliciaFederal.map((sigla) => (
										<SelectItem key={sigla} value={sigla}>
											{sigla}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium text-foreground">
								Período
							</Label>
							<Select
								value={periodo}
								onValueChange={(value) => setPeriodo(value as PeriodoValue)}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{periodos.map((per) => (
										<SelectItem key={per.value} value={per.value}>
											{per.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Cards de Estatísticas */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatCard
					title="Média de Dias"
					value={isLoadingStats ? "..." : formatDays(aggregatedStats.avgDays)}
					icon={Calendar}
					description="Tempo médio de deferimento no período"
				/>
				<StatCard
					title="Menor Prazo"
					icon={TrendingUp}
					value={isLoadingStats ? "..." : formatDays(aggregatedStats.minDays)}
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

			{/* Gráfico */}
			<Card>
				<CardHeader>
					<CardTitle>Evolução Mensal dos Prazos</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="mes" fontSize={12} />
							<YAxis
								fontSize={12}
								label={{ value: "Dias", angle: -90, position: "insideLeft" }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "hsl(var(--card))",
									border: "1px solid hsl(var(--border))",
									borderRadius: "var(--radius)",
								}}
							/>
							<Line
								type="monotone"
								dataKey="dias"
								strokeWidth={3}
								dot={{ fill: "hsl(var(--primary))", r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Tabela de Envios Recentes */}
			<Card>
				<CardHeader>
					<CardTitle>Envios Recentes</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>OM</TableHead>
								<TableHead>Processo</TableHead>
								<TableHead>Dias</TableHead>
								<TableHead>Situação</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentSubmissions.map((submission, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <nao tem id>
								<TableRow key={submission.omName + index}>
									<TableCell className="font-medium">
										{submission.omName}
									</TableCell>
									<TableCell>
										{processTypeLabels[submission.processType] ??
											submission.processType}
									</TableCell>
									<TableCell>{formatDays(submission.avgDays)}</TableCell>
									<TableCell>
										<Badge
											variant={
												submission.result === "DEFERIDO"
													? "default"
													: submission.result === "INDEFERIDO"
														? "destructive"
														: "secondary"
											}
										>
											{submission.result}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
