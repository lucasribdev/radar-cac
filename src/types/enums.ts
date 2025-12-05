export const PROCESS_RESULT_ENUM = ["DEFERIDO", "INDEFERIDO"] as const;
export type ProcessResultEnum = (typeof PROCESS_RESULT_ENUM)[number];

export const TYPE_ENUM = [
	"CR_OBTER",
	"CR_REVALIDAR",
	"CR_APOSTILAR",
	"CR_CANCELAR",
	"AQUISICAO_ARMA_SOLICITAR",
	"ARMA_REGISTRAR",
	"REGISTRO_ARMA_RENOVAR",
	"TRANSFERENCIA_ARMA_CAC_SOLICITAR",
	"ALTERAR_NIVEL_ATIRADOR",
	"TRANSFERENCIA_ACERVO_MESMO_PROP",
	"TRANSFERENCIA_ACERVO_CAC_OBTER",
	"TRANSFERENCIA_SI_DP_PARA_CAC_SOLICITAR",
	"TRANSFERENCIA_SI_DP_PARA_CAC_OBTER",
	"TRANSFERENCIA_CAC_PARA_SI_DP_SOLICITAR",
	"TRANSFERENCIA_CAC_PARA_SI_DP_OBTER",
	"CR_SEGUNDA_VIA_SOLICITAR",
	"CR_SEGUNDA_VIA_OBTER",
	"REGISTRO_ARMA_SEGUNDA_VIA_OBTER",
	"GUIA_TRÁFEGO_ESPECIAL_OBTER",
] as const;
export type TypeEnum = (typeof TYPE_ENUM)[number];

export const TYPE_LABELS: Record<TypeEnum, string> = {
	CR_OBTER: "Obter Certificado de Registro",
	CR_REVALIDAR: "Revalidar Certificado de Registro",
	CR_APOSTILAR: "Apostilar Certificado de Registro",
	CR_CANCELAR: "Cancelar Certificado de Registro",
	AQUISICAO_ARMA_SOLICITAR: "Solicitar Aquisição de Arma",
	ARMA_REGISTRAR: "Registrar Arma de Fogo",
	REGISTRO_ARMA_RENOVAR: "Renovar Registro de Arma",
	TRANSFERENCIA_ARMA_CAC_SOLICITAR: "Solicitar Transferência de Arma (CAC)",
	ALTERAR_NIVEL_ATIRADOR: "Alterar Nível de Atirador",
	TRANSFERENCIA_ACERVO_MESMO_PROP:
		"Transferir entre Acervos do Mesmo Proprietário",
	TRANSFERENCIA_ACERVO_CAC_OBTER: "Transferir entre Acervos (CAC)",
	TRANSFERENCIA_SI_DP_PARA_CAC_SOLICITAR:
		"Solicitar Transferência para SINARM-CAC",
	TRANSFERENCIA_SI_DP_PARA_CAC_OBTER: "Obter Transferência para SINARM-CAC",
	TRANSFERENCIA_CAC_PARA_SI_DP_SOLICITAR:
		"Solicitar Transferência do SINARM-CAC",
	TRANSFERENCIA_CAC_PARA_SI_DP_OBTER: "Obter Transferência do SINARM-CAC",
	CR_SEGUNDA_VIA_SOLICITAR: "Solicitar 2ª Via do Certificado de Registro",
	CR_SEGUNDA_VIA_OBTER: "Obter 2ª Via do Certificado de Registro",
	REGISTRO_ARMA_SEGUNDA_VIA_OBTER: "Obter 2ª Via do Registro de Arma",
	GUIA_TRÁFEGO_ESPECIAL_OBTER: "Obter Guia de Tráfego Especial",
};

export const TYPE_OPTIONS = TYPE_ENUM.map((value) => ({
	value,
	label: TYPE_LABELS[value],
}));

export function getTypeLabel(type: TypeEnum | string) {
	return TYPE_LABELS[type as TypeEnum] ?? type;
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
