import { useQuery } from "@tanstack/react-query";
import { formatDate, formatDays } from "@/lib/format";
import { fetchRecentSubmissions } from "@/services/submissions";
import {
	getProcessTypeLabel,
	type OmEnum,
	type ProcessTypeEnum,
} from "@/types/enums";
import { EmptyState, ErrorState, TableSkeleton } from "./LoadingStates";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

interface RecentsTableProps {
	processType: ProcessTypeEnum;
	om: OmEnum;
}

export const RecentsTable = ({ processType, om }: RecentsTableProps) => {
	const {
		data: recentSubmissions = [],
		isFetching: isLoadingRecents,
		error: recentsError,
		refetch: refetchRecents,
	} = useQuery({
		queryKey: ["recent-submissions", processType, om],
		queryFn: () => fetchRecentSubmissions({ processType, om }),
	});

	if (isLoadingRecents) {
		return <TableSkeleton rows={6} />;
	}

	if (recentsError) {
		return (
			<ErrorState
				message="Não foi possível carregar os envios recentes."
				onRetry={() => refetchRecents()}
			/>
		);
	}

	if (!recentSubmissions.length) {
		return (
			<EmptyState
				title="Sem envios recentes"
				description="Nenhum envio foi encontrado para os filtros selecionados."
			/>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Envios Recentes</CardTitle>
			</CardHeader>
			<CardContent>
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
									{formatDate(submission.createdAt)}
								</TableCell>
								<TableCell className="font-medium">{submission.om}</TableCell>
								<TableCell>
									{getProcessTypeLabel(submission.processType)}
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
	);
};
