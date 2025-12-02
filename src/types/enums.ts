export const PROCESS_RESULT_ENUM = ["DEFERIDO", "INDEFERIDO"] as const;
export type ProcessResultEnum = (typeof PROCESS_RESULT_ENUM)[number];

export const PROCESS_TYPE_ENUM = [
	"CR",
	"AUTORIZACAO_COMPRA",
	"CRAF",
	"GUIA_TRAFEGO",
] as const;
export type ProcessTypeEnum = (typeof PROCESS_TYPE_ENUM)[number];
