import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Combobox } from "@/components/Combobox";
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
import {
	type OmEnum,
	PF_OM_OPTIONS,
	PROCESS_TYPE_OPTIONS,
} from "@/types/enums";

export const Route = createFileRoute("/")({ component: App });

const processTypeOptions = [
	{ value: "Todos", label: "Todos" },
	...PROCESS_TYPE_OPTIONS,
] as const;

type ProcessTypeValue = (typeof processTypeOptions)[number]["value"];

const periodOptions = [
	{ value: "7d", label: "Últimos 7 dias" },
	{ value: "30d", label: "Últimos 30 dias" },
	{ value: "90d", label: "Últimos 90 dias" },
	{ value: "12m", label: "Últimos 12 meses" },
] as const;

export type PeriodValue = (typeof periodOptions)[number]["value"];
type OmValue = OmEnum | "Todas";
const omOptions: { value: OmValue; label: string }[] = [
	{ value: "Todas", label: "Todas" },
	...PF_OM_OPTIONS,
];

function App() {
	const [processType, setProcessType] = useState<ProcessTypeValue>("Todos");
	const [om, setOm] = useState<OmValue>("Todas");
	const [period, setPeriod] = useState<PeriodValue>("90d");

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
								value={processType}
								onValueChange={(value) =>
									setProcessType(value as ProcessTypeValue)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{processTypeOptions.map((tipo) => (
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
								onChange={(value) => setOm((value as OmValue) || "Todas")}
								placeholder="Todas as OMs"
								searchPlaceholder="Pesquisar a OM..."
								emptyMessage="Nenhuma OM encontrada."
							/>
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

			{/* Cards de Estatísticas */}
			<ProcessStats processType={processType} om={om} period={period} />

			{/* Gráfico */}
			{/* <EvolutionChart processType={processType} om={om} /> */}

			{/* Tabela de Envios Recentes */}
			<RecentsTable processType={processType} om={om} />
		</div>
	);
}
