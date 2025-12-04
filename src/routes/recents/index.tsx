import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	EmptyState,
	ErrorState,
	TableSkeleton,
} from "@/components/LoadingStates";
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
import { formatDate, formatDays } from "@/lib/format";
import { fetchRecentSubmissions } from "@/services/submissions";
import { getProcessTypeLabel } from "@/types/enums";

export const Route = createFileRoute("/recents/")({ component: Recents });

function Recents() {
	const {
		data: recentSubmissions = [],
		isFetching: isLoadingRecents,
		error: recentsError,
		refetch: refetchRecents,
	} = useQuery({
		queryKey: ["recent-submissions-page"],
		queryFn: () => fetchRecentSubmissions({ limit: 10 }),
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

			{isLoadingRecents ? (
				<TableSkeleton rows={10} />
			) : recentsError ? (
				<ErrorState
					message="Não foi possível carregar os envios recentes."
					onRetry={() => refetchRecents()}
				/>
			) : !recentSubmissions.length ? (
				<EmptyState
					title="Nenhum envio recente"
					description="Ainda não há envios cadastrados. Volte em breve."
				/>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Todos os Envios</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Data de criação</TableHead>
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
												{formatDate(submission.createdAt ?? "")}
											</TableCell>
											<TableCell className="font-medium">
												{submission.om}
											</TableCell>
											<TableCell>
												{getProcessTypeLabel(submission.processType)}
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
			)}
		</div>
	);
}
