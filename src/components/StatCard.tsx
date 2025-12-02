import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	description?: string;
}

export const StatCard = ({
	title,
	value,
	icon: Icon,
	description,
}: StatCardProps) => {
	return (
		<Card className="hover:shadow-lg transition-shadow">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="h-5 w-5 text-primary" />
			</CardHeader>
			<CardContent>
				<div className="text-3xl font-bold text-foreground">{value}</div>
				{description && (
					<p className="text-xs text-muted-foreground mt-1">{description}</p>
				)}
			</CardContent>
		</Card>
	);
};
