/** biome-ignore-all lint/suspicious/noArrayIndexKey: <apenas skeleton> */
import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton = () => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-4 w-4 rounded" />
		</CardHeader>
		<CardContent>
			<Skeleton className="h-8 w-16 mb-1" />
			<Skeleton className="h-3 w-32" />
		</CardContent>
	</Card>
);

export const ChartSkeleton = () => (
	<Card>
		<CardHeader>
			<Skeleton className="h-6 w-48" />
		</CardHeader>
		<CardContent>
			<div className="h-[300px] flex items-end justify-between gap-2 px-4">
				{[...Array(6)].map((_, i) => (
					<Skeleton
						key={i}
						className="w-full"
						style={{ height: `${Math.random() * 60 + 40}%` }}
					/>
				))}
			</div>
		</CardContent>
	</Card>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
	<Card>
		<CardHeader>
			<Skeleton className="h-6 w-40" />
		</CardHeader>
		<CardContent>
			<div className="space-y-3">
				<div className="flex gap-4 pb-2 border-b border-border">
					{[...Array(5)].map((_, i) => (
						<Skeleton key={i} className="h-4 w-20" />
					))}
				</div>
				{[...Array(rows)].map((_, i) => (
					<div key={i} className="flex gap-4 py-2">
						{[...Array(5)].map((_, j) => (
							<Skeleton key={j} className="h-4 w-20" />
						))}
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

export const FiltersOmsSkeleton = () => (
	<Card>
		<CardContent>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		</CardContent>
	</Card>
);

export const FiltersIndexSkeleton = () => (
	<Card>
		<CardContent className="pt-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full" />
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

interface ErrorStateProps {
	message?: string;
	onRetry?: () => void;
}

export const ErrorState = ({
	message = "Erro ao carregar dados. Verifique sua conexão.",
	onRetry,
}: ErrorStateProps) => (
	<Card className="border-destructive/50">
		<CardContent className="flex flex-col items-center justify-center py-12 text-center">
			<AlertCircle className="h-12 w-12 text-destructive mb-4" />
			<h3 className="text-lg font-semibold text-foreground mb-2">
				Ops! Algo deu errado
			</h3>
			<p className="text-muted-foreground mb-4 max-w-md">{message}</p>
			{onRetry && (
				<Button onClick={onRetry} variant="outline">
					Tentar novamente
				</Button>
			)}
		</CardContent>
	</Card>
);

interface EmptyStateProps {
	title?: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export const EmptyState = ({
	title = "Nenhum dado encontrado",
	description = "Não há registros para exibir no momento.",
	action,
}: EmptyStateProps) => (
	<Card>
		<CardContent className="flex flex-col items-center justify-center py-12 text-center">
			<Inbox className="h-12 w-12 text-muted-foreground mb-4" />
			<h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
			<p className="text-muted-foreground mb-4 max-w-md">{description}</p>
			{action && (
				<Button onClick={action.onClick} variant="default">
					{action.label}
				</Button>
			)}
		</CardContent>
	</Card>
);
