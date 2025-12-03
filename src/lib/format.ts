export function formatDays(value: number | null) {
	if (value === null || Number.isNaN(value)) return "--";
	return `${Math.round(value)} dias`;
}

export function formatDate(value: string) {
	if (!value) return "--";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("pt-BR");
}

export function formatNumber(value: number, locale: string = "pt-BR") {
	return value.toLocaleString(locale);
}
