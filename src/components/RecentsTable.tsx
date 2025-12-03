import { useQuery } from "@tanstack/react-query";
import { formatDays } from "@/lib/format";
import { fetchRecentSubmissions } from "@/services/submissions";
import { getProcessTypeLabel, type ProcessTypeEnum } from "@/types/enums";
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
	processType: ProcessTypeEnum | "Todos";
	om: string | "Todas";
}

export const RecentsTable = ({ processType, om }: RecentsTableProps) => {
	const { data: recentSubmissions = [] } = useQuery({
		queryKey: ["recent-submissions", processType, om],
		queryFn: () => fetchRecentSubmissions({ processType, om }),
	});

	return (
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
						{recentSubmissions.map((submission) => (
							<TableRow key={submission.id}>
								<TableCell className="font-medium">
									{submission.omName}
								</TableCell>
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
