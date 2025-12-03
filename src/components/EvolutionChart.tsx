import { useQuery } from "@tanstack/react-query";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { fetchMonthlyStats } from "@/services/submissions";
import type { ProcessTypeEnum } from "@/types/enums";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface EvolutionChartProps {
	processType?: ProcessTypeEnum | "Todos";
	om?: string | "Todas";
}

export const EvolutionChart = ({ processType, om }: EvolutionChartProps) => {
	const { data: chartData = [] } = useQuery({
		queryKey: ["submissions-monthly-stats", processType, om],
		queryFn: () => fetchMonthlyStats({ processType, om }),
	});
	return (
		<Card>
			<CardHeader>
				<CardTitle>Evolução Mensal dos Prazos</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" fontSize={12} />
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
							dataKey="avgDays"
							strokeWidth={3}
							dot={{ fill: "hsl(var(--primary))", r: 4 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
