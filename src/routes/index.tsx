import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-foreground mb-2">Olá Mundo!</h1>
			</div>
		</div>
	);
}
