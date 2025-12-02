import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, FileText, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { StatCard } from "@/components/StatCard";
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

type SubmissionStatsRow = {
	process_type: ProcessTypeEnum;
	total: number;
	avg_days: number | null;
	min_days: number | null;
	max_days: number | null;
};

type AggregatedStats = {
	total: number;
	avgDays: number | null;
	minDays: number | null;
	maxDays: number | null;
};

type SubmissionRow = {
	process_type: ProcessTypeEnum;
	om_name: string;
	date_protocol: string;
	date_decision: string;
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
}): Promise<SubmissionStatsRow[]> {
	let query = supabaseClient
		.from("submissions")
		.select("process_type, om_name, date_protocol, date_decision");

	if (processType !== "Todos") {
		query = query.eq("process_type", processType);
	}

	if (om !== "Todas") {
		query = query.eq("om_name", om);
	}

	const daysRange = periodToDays[periodo];
	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - daysRange);
	query = query.gte("date_protocol", fromDate.toISOString().slice(0, 10));

	const { data, error } = await query.returns<SubmissionRow[]>();
	if (error) {
		throw error;
	}

	return computeStats(data ?? []);
}

function aggregateStats(stats: SubmissionStatsRow[]): AggregatedStats {
	if (stats.length === 0) {
		return { total: 0, avgDays: null, minDays: null, maxDays: null };
	}

	const total = stats.reduce((acc, curr) => acc + curr.total, 0);
	const weightedAvg =
		total === 0
			? null
			: stats.reduce((acc, curr) => {
					if (curr.avg_days === null) return acc;
					return acc + curr.avg_days * curr.total;
				}, 0) / total;

	const minDays = stats.reduce<number | null>((acc, curr) => {
		if (curr.min_days === null) return acc;
		if (acc === null) return curr.min_days;
		return Math.min(acc, curr.min_days);
	}, null);

	const maxDays = stats.reduce<number | null>((acc, curr) => {
		if (curr.max_days === null) return acc;
		if (acc === null) return curr.max_days;
		return Math.max(acc, curr.max_days);
	}, null);

	return {
		total,
		avgDays: weightedAvg,
		minDays,
		maxDays,
	};
}

function formatDays(value: number | null) {
	if (value === null || Number.isNaN(value)) return "--";
	return `${Math.round(value)} dias`;
}

function formatNumber(value: number) {
	return value.toLocaleString("pt-BR");
}

function computeStats(rows: SubmissionRow[]): SubmissionStatsRow[] {
	const grouped = new Map<
		ProcessTypeEnum,
		{ total: number; sum: number; min: number | null; max: number | null }
	>();

	for (const row of rows) {
		const days = Math.round(
			(new Date(row.date_decision).getTime() -
				new Date(row.date_protocol).getTime()) /
				(1000 * 60 * 60 * 24),
		);

		const current = grouped.get(row.process_type) ?? {
			total: 0,
			sum: 0,
			min: null,
			max: null,
		};

		current.total += 1;
		if (!Number.isNaN(days)) {
			current.sum += days;
			current.min = current.min === null ? days : Math.min(current.min, days);
			current.max = current.max === null ? days : Math.max(current.max, days);
		}

		grouped.set(row.process_type, current);
	}

	return Array.from(grouped.entries()).map(([process_type, data]) => ({
		process_type,
		total: data.total,
		avg_days: data.total > 0 ? data.sum / data.total : null,
		min_days: data.min,
		max_days: data.max,
	}));
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
		data: stats = [],
		isFetching: isLoadingStats,
		error: statsError,
	} = useQuery({
		queryKey: ["submissions-stats", tipoProcesso, om, periodo],
		queryFn: () =>
			fetchSubmissionStats({ processType: tipoProcesso, om, periodo }),
	});
	const aggregatedStats = useMemo(() => aggregateStats(stats), [stats]);

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			<div>
				<h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
				<p className="text-muted-foreground">
					Estatísticas em tempo real dos processos Sinarm CAC
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

			<Card>
				<CardHeader>
					<CardTitle>Resumo por Tipo de Processo</CardTitle>
					<p className="text-sm text-muted-foreground">
						{isLoadingStats
							? "Carregando estatísticas..."
							: statsError
								? "Erro ao carregar estatísticas."
								: "Média, menor e maior prazo por tipo no período selecionado."}
					</p>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Tipo</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Média</TableHead>
								<TableHead>Mínimo</TableHead>
								<TableHead>Máximo</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoadingStats ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center">
										Carregando...
									</TableCell>
								</TableRow>
							) : statsError ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center text-red-500">
										Erro ao carregar estatísticas.
									</TableCell>
								</TableRow>
							) : stats.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center">
										Nenhum dado disponível para o filtro.
									</TableCell>
								</TableRow>
							) : (
								stats.map((row) => (
									<TableRow key={row.process_type}>
										<TableCell className="font-medium">
											{processTypeLabels[row.process_type]}
										</TableCell>
										<TableCell>{formatNumber(row.total)}</TableCell>
										<TableCell>{formatDays(row.avg_days)}</TableCell>
										<TableCell>{formatDays(row.min_days)}</TableCell>
										<TableCell>{formatDays(row.max_days)}</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Gráfico */}
			{/* <Card>
				<CardHeader>
					<CardTitle>Evolução Mensal dos Prazos</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={chartData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="hsl(var(--border))"
							/>
							<XAxis
								dataKey="mes"
								stroke="hsl(var(--muted-foreground))"
								fontSize={12}
							/>
							<YAxis
								stroke="hsl(var(--muted-foreground))"
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
								stroke="hsl(var(--primary))"
								strokeWidth={3}
								dot={{ fill: "hsl(var(--primary))", r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card> */}

			{/* Tabela de Envios Recentes */}
			{/* <Card>
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
								<TableRow key={index}>
									<TableCell className="font-medium">{submission.om}</TableCell>
									<TableCell>{submission.processo}</TableCell>
									<TableCell>{submission.dias}</TableCell>
									<TableCell>
										<Badge
											variant={
												submission.situacao === "Deferido"
													? "default"
													: submission.situacao === "Indeferido"
														? "destructive"
														: "secondary"
											}
										>
											{submission.situacao}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card> */}
		</div>
	);
}
