import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ErrorState, FiltersOmsSkeleton } from "@/components/LoadingStates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOms } from "@/services/oms";
export const Route = createFileRoute("/oms/")({ component: Oms });

const omsSkeletonPlaceholders = Array.from(
	{ length: 12 },
	(_, index) => `om-skeleton-${index}`,
);

function Oms() {
	const [searchTerm, setSearchTerm] = useState("");

	const {
		data: oms = [],
		isFetching: isLoadingOms,
		error: omsError,
		refetch: refetchStats,
	} = useQuery({
		queryKey: ["oms"],
		queryFn: fetchOms,
	});

	const filteredOMs = useMemo(() => {
		return oms.filter((om) => {
			const matchesSearch =
				om.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
				om.email.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesSearch;
		});
	}, [searchTerm, oms]);

	if (omsError) {
		return (
			<ErrorState
				message="Não foi possível carregar as estatísticas."
				onRetry={() => refetchStats()}
			/>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground mb-2">
					Contatos das OMs
				</h1>
				<p className="text-muted-foreground">
					Encontre os dados de contato dos Órgãos de Monitoramento da Polícia
					Federal
				</p>
			</div>

			{/* Filters */}
			<div className="mb-6">
				{isLoadingOms ? (
					<FiltersOmsSkeleton />
				) : (
					<Card>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Buscar por nome ou sigla..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Results count */}
			<div className="mb-4 flex items-center gap-2">
				{isLoadingOms ? (
					<>
						<Skeleton className="h-5 w-5 rounded" />
						<Skeleton className="h-4 w-40" />
					</>
				) : (
					<>
						<Building2 className="h-5 w-5 text-muted-foreground" />
						<span className="text-muted-foreground">
							{filteredOMs.length}{" "}
							{filteredOMs.length === 1 ? "OM encontrada" : "OMs encontradas"}
						</span>
					</>
				)}
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{isLoadingOms
						? omsSkeletonPlaceholders.map((placeholder) => (
								<Card key={placeholder} className="gap-0">
									<CardHeader className="pb-3">
										<Skeleton className="h-5 w-32" />
									</CardHeader>
									<CardContent className="space-y-3">
										<Skeleton className="h-4 w-10/12" />
										<Skeleton className="h-4 w-6/12" />
									</CardContent>
								</Card>
							))
						: filteredOMs.map((om) => (
								<Card
									key={om.id}
									className="gap-0 hover:shadow-md transition-shadow"
								>
									<CardHeader className="pb-3">
										<CardTitle className="text-base font-semibold leading-tight">
											{om.unit}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<a
											href={`mailto:${om.email}`}
											className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors break-all"
										>
											<Mail className="h-4 w-4 flex-shrink-0" />
											<span>{om.email}</span>
										</a>
									</CardContent>
								</Card>
							))}
				</div>
			</div>

			{!isLoadingOms && filteredOMs.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center">
						<Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Nenhuma OM encontrada
						</h3>
						<p className="text-muted-foreground">
							Tente ajustar os filtros ou termos de busca.
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
