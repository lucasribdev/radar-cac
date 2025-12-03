import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import Header from "../components/Header";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Radar CAC — Painel comunitário",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
	notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body suppressHydrationWarning>
				<Header />
				<section className="bg-muted text-muted-foreground border-b border-border px-4 py-3 text-sm">
					<p className="max-w-5xl mx-auto text-center">
						<strong className="font-semibold text-foreground">Aviso:</strong> Os
						dados são enviados pela comunidade, podem conter erros e não há
						garantia de prazos reais.
					</p>
				</section>
				<main className="min-h-screen">{children}</main>
				<footer className="border-t border-border bg-card text-muted-foreground">
					<div className="max-w-5xl mx-auto px-4 py-6 text-sm space-y-2">
						<p className="text-foreground font-semibold">Radar CAC</p>
						<p>
							Projeto comunitário para visualizar prazos de processos CAC.
							Informações enviadas por usuários podem ter erros e não
							representam prazos garantidos.
						</p>
					</div>
				</footer>
				<Toaster />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function NotFound() {
	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-10">
			<div>
				<p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
					Erro 404
				</p>
				<h1 className="text-3xl font-semibold text-slate-900">
					Página não encontrada
				</h1>
			</div>
			<p className="text-slate-600">
				A rota acessada não existe ou foi movida. Volte para a página inicial ou
				verifique o endereço digitado.
			</p>
			<div>
				<Link
					to="/"
					className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
				>
					<span>Ir para o início</span>
				</Link>
			</div>
		</div>
	);
}
