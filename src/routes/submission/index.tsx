import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/submission/")({ component: Submission });

function Submission() {
	return <div>Olá submission!</div>;
}
