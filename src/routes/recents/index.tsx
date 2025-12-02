import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recents/")({ component: Recent });

function Recent() {
	return <div>Olá submission!</div>;
}
