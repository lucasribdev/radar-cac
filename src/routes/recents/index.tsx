import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recents/")({ component: Recents });

function Recents() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-foreground mb-2">
					Processos Recentes
				</h1>
				<p className="text-muted-foreground">
					Últimos processos enviados pela comunidade
				</p>
			</div>
		</div>
	);
}
