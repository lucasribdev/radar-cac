import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Combobox } from "@/components/Combobox";
import { EmptyState } from "@/components/LoadingStates";
import { ProcessStats } from "@/components/ProcessStats";
import { RecentsTable } from "@/components/RecentsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetchOms } from "@/services/oms";
import { TYPE_OPTIONS } from "@/types/enums";
import { toOmOption } from "@/types/oms";

export const Route = createFileRoute("/")({ component: App });

const typeOptions = TYPE_OPTIONS;
type TypeValue = (typeof TYPE_OPTIONS)[number]["value"];

const periodOptions = [
	{ value: "7d", label: "Últimos 7 dias" },
	{ value: "30d", label: "Últimos 30 dias" },
	{ value: "90d", label: "Últimos 90 dias" },
	{ value: "12m", label: "Últimos 12 meses" },
] as const;

export type PeriodValue = (typeof periodOptions)[number]["value"];
type OmValue = string;

function App() {
	const {
		data: oms = [],
		isFetching: isLoadingOms,
		error: omsError,
	} = useQuery({
		queryKey: ["oms"],
		queryFn: fetchOms,
	});

	const omOptions = useMemo(() => oms.map((om) => toOmOption(om)), [oms]);

	const [type, setType] = useState<TypeValue | "">("AQUISICAO_ARMA_SOLICITAR");
	const [om, setOm] = useState<OmValue | "">("UCAC/DELEARM/DREX/SR/PF/SP");
	const [period, setPeriod] = useState<PeriodValue>("90d");

	const selectedOmId = om ? Number(om) : undefined;
	const isOmSelected = Number.isFinite(selectedOmId);

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
								value={type}
								onValueChange={(value) => setType(value as TypeValue)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecione o processo" />
								</SelectTrigger>
								<SelectContent>
									{typeOptions.map((tipo) => (
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
							<Combobox
								options={omOptions}
								value={om}
								onChange={(value) => setOm(value as OmValue)}
								placeholder={
									isLoadingOms
										? "Carregando OMs..."
										: omsError
											? "Erro ao carregar OMs"
											: "Selecione a OM"
								}
								searchPlaceholder="Pesquisar a OM..."
								emptyMessage={
									omsError
										? "Erro ao carregar OMs."
										: isLoadingOms
											? "Carregando OMs..."
											: "Nenhuma OM encontrada."
								}
							/>
							{omsError ? (
								<p className="text-sm text-destructive">
									Não foi possível carregar a lista de OMs.
								</p>
							) : null}
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-medium text-foreground">
								Período
							</Label>
							<Select
								value={period}
								onValueChange={(value) => setPeriod(value as PeriodValue)}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{periodOptions.map((per) => (
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

			{type === "" || !isOmSelected ? (
				<EmptyState
					title="Selecione os filtros"
					description="Escolha o tipo de processo e a OM da Polícia Federal para visualizar as estatísticas."
				/>
			) : (
				<>
					{/* Cards de Estatísticas */}
					<ProcessStats type={type} omId={selectedOmId!} period={period} />

					{/* Gráfico */}
					{/* <EvolutionChart type={type} omId={selectedOmId!} /> */}

					{/* Tabela de Envios Recentes */}
					<RecentsTable type={type} omId={selectedOmId!} />
				</>
			)}
		</div>
	);
}
