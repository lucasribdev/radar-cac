import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { supabaseClient } from "@/lib/supabaseClient";
import type { ProcessTypeEnum } from "@/types/enums";

export const Route = createFileRoute("/recents/")({ component: Recents });

const processTypeLabels: Record<ProcessTypeEnum, string> = {
	CR: "CR",
	AUTORIZACAO_COMPRA: "Autorização de Compra",
	CRAF: "CRAF",
	GUIA_TRAFEGO: "Guia de Tráfego",
};

type RecentSubmission = {
	id: string;
	createdAt: string;
	omName: string;
	processType: ProcessTypeEnum;
	result: string;
	avgDays: number | null;
};

async function fetchRecentSubmissions(): Promise<RecentSubmission[]> {
	const { data, error } = await supabaseClient.rpc("get_recent_submissions", {
		p_om_name: null,
		p_process_type: null,
		p_limit: 10,
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

function formatDate(value: string) {
	if (!value) return "--";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("pt-BR");
}

function Recents() {
	const { data: recentSubmissions = [] } = useQuery({
		queryKey: ["recent-submissions-page"],
		queryFn: fetchRecentSubmissions,
	});

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-foreground mb-2">
					Processos Recentes
				</h1>
				<p className="text-muted-foreground">
					Últimos processos enviados pela comunidade.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Todos os Envios</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Data</TableHead>
									<TableHead>OM</TableHead>
									<TableHead>Processo</TableHead>
									<TableHead>Dias</TableHead>
									<TableHead>Situação</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentSubmissions.map((submission) => (
									<TableRow key={submission.id}>
										<TableCell className="text-muted-foreground">
											{formatDate(submission.createdAt)}
										</TableCell>
										<TableCell className="font-medium">
											{submission.omName}
										</TableCell>
										<TableCell>
											{processTypeLabels[submission.processType] ??
												submission.processType}
										</TableCell>
										<TableCell className="font-semibold">
											{formatDays(submission.avgDays)}
										</TableCell>
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
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
