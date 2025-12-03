export const PROCESS_RESULT_ENUM = ["DEFERIDO", "INDEFERIDO"] as const;
export type ProcessResultEnum = (typeof PROCESS_RESULT_ENUM)[number];

export const PROCESS_TYPE_ENUM = [
	"CR",
	"AUTORIZACAO_COMPRA",
	"CRAF",
	"GUIA_TRAFEGO",
] as const;
export type ProcessTypeEnum = (typeof PROCESS_TYPE_ENUM)[number];

export const PROCESS_TYPE_LABELS: Record<ProcessTypeEnum, string> = {
	CR: "CR",
	AUTORIZACAO_COMPRA: "Autorização de Compra",
	CRAF: "CRAF",
	GUIA_TRAFEGO: "Guia de Tráfego",
};

export const PROCESS_TYPE_OPTIONS = PROCESS_TYPE_ENUM.map((value) => ({
	value,
	label: PROCESS_TYPE_LABELS[value],
}));

export function getProcessTypeLabel(processType: ProcessTypeEnum | string) {
	return PROCESS_TYPE_LABELS[processType as ProcessTypeEnum] ?? processType;
}

export const PROCESS_RESULT_LABELS: Record<ProcessResultEnum, string> = {
	DEFERIDO: "Deferido",
	INDEFERIDO: "Indeferido",
};

export const PROCESS_RESULT_OPTIONS = PROCESS_RESULT_ENUM.map((value) => ({
	value,
	label: PROCESS_RESULT_LABELS[value],
}));

export function getProcessResultLabel(result: ProcessResultEnum | string) {
	return PROCESS_RESULT_LABELS[result as ProcessResultEnum] ?? result;
}
