export const PROCESS_RESULT_ENUM = ["DEFERIDO", "INDEFERIDO"] as const;
export type ProcessResultEnum = (typeof PROCESS_RESULT_ENUM)[number];

export const PF_OM_LIST = [
	{ sigla: "DPF/AGA/TO", unidade: "UCAC/NUARM/DPF/AGA/TO" },
	{ sigla: "DPF/ANS/GO", unidade: "UCAC/NUARM/DPF/ANS/GO" },
	{ sigla: "DPF/AQA/SP", unidade: "UCAC/NPA/DPF/AQA/SP" },
	{ sigla: "DPF/ARS/RJ", unidade: "UCAC/NUARM/DPF/ARS/RJ" },
	{ sigla: "DPF/ARU/SP", unidade: "UCAC/NUARM/DPF/ARU/SP" },
	{ sigla: "DPF/ATM/PA", unidade: "UCAC/NPA/DPF/ATM/PA" },
	{ sigla: "DPF/BGE/RS", unidade: "UCAC/NUARM/DPF/BGE/RS" },
	{ sigla: "DPF/BRA/BA", unidade: "UCAC/NUARM/DPF/BRA/BA" },
	{ sigla: "DPF/BRG/MT", unidade: "UCAC/NUARM/DPF/BRG/MT" },
	{ sigla: "DPF/BRU/SP", unidade: "UCAC/NUARM/DPF/BRU/SP" },
	{ sigla: "DPF/CAC/PR", unidade: "UCAC/NUARM/DPF/CAC/PR" },
	{ sigla: "DPF/CAE/MT", unidade: "UCAC/NUARM/DPF/CAE/MT" },
	{ sigla: "DPF/CAS/SP", unidade: "UCAC/NUARM/DELEX/DPF/CAS/SP" },
	{ sigla: "DPF/CCM/SC", unidade: "UCAC/NUARM/DPF/CCM/SC" },
	{ sigla: "DPF/CGE/PB", unidade: "UCAC/NUARM/DPF/CGE/PB" },
	{ sigla: "DPF/CHI/RS", unidade: "UCAC/NPA/DPF/CHI/RS" },
	{ sigla: "DPF/CIT/ES", unidade: "UCAC/NUARM/DPF/CIT/ES" },
	{ sigla: "DPF/CRU/PE", unidade: "UCAC/NUARM/DPF/CRU/PE" },
	{ sigla: "DPF/CXA/MA", unidade: "UCAC/NUARM/DPF/CXA/MA" },
	{ sigla: "DPF/CXS/RS", unidade: "UCAC/NUARM/DPF/CXS/RS" },
	{ sigla: "DPF/CZO/SP", unidade: "UCAC/NUARM/DPF/CZO/SP" },
	{ sigla: "DPF/CZS/AC", unidade: "UCAC/NPA/DPF/CZS/AC" },
	{ sigla: "DPF/DCQ/SC", unidade: "UCAC/NUARM/DPF/DCQ/SC" },
	{ sigla: "DPF/DVS/MG", unidade: "UCAC/NUARM/DPF/DVS/MG" },
	{ sigla: "DPF/EPA/AC", unidade: "UCAC/NPA/DPF/EPA/AC" },
	{ sigla: "DPF/FIG/PR", unidade: "UCAC/NUARM/DELEX/DPF/FIG/PR" },
	{ sigla: "DPF/FSA/BA", unidade: "DPF/FSA/BA" },
	{ sigla: "DPF/GMI/RO", unidade: "UCAC/NPA/DPF/GMI/RO" },
	{ sigla: "DPF/GOY/RJ", unidade: "UCAC/NPA/DPF/GOY/RJ" },
	{ sigla: "DPF/GPB/PR", unidade: "UCAC/NUARM/DPF/GPB/PR" },
	{ sigla: "DPF/GRA/PR", unidade: "UCAC/NUARM/DPF/GRA/PR" },
	{ sigla: "DPF/GVS/MG", unidade: "UCAC/NUARM/DPF/GVS/MG" },
	{ sigla: "DPF/IJI/SC", unidade: "UCAC/NUARM/DPF/IJI/SC" },
	{ sigla: "DPF/ILS/BA", unidade: "UCAC/NUARM/DPF/ILS/BA" },
	{ sigla: "DPF/IPN/MG", unidade: "UCAC/NUARM/DPF/IPN/MG" },
	{ sigla: "DPF/ITZ/MA", unidade: "UCAC/NUARM/DPF/ITZ/MA" },
	{ sigla: "DPF/JFA/MG", unidade: "UCAC/NUARM/DPF/JFA/MG" },
	{ sigla: "DPF/JGO/RS", unidade: "UCAC/NUARM/DPF/JGO/RS" },
	{ sigla: "DPF/JLS/SP", unidade: "UCAC/NUARM/DPF/JLS/SP" },
	{ sigla: "DPF/JNE/CE", unidade: "UCAC/NUARM/DPF/JNE/CE" },
	{ sigla: "DPF/JPN/RO", unidade: "UCAC/NUARM/DPF/JPN/RO" },
	{ sigla: "DPF/JTI/GO", unidade: "UCAC/NUARM/DPF/JTI/GO" },
	{ sigla: "DPF/JVE/SC", unidade: "UCAC/NUARM/DPF/JVE/SC" },
	{ sigla: "DPF/JZO/BA", unidade: "UCAC/NUARM/DPF/JZO/BA" },
	{ sigla: "DPF/LDA/PR", unidade: "UCAC/NUARM/DPF/LDA/PR" },
	{ sigla: "DPF/LGE/SC", unidade: "UCAC/NUARM/DPF/LGE/SC" },
	{ sigla: "DPF/LIV/RS", unidade: "UCAC/NUARM/DPF/LIV/RS" },
	{ sigla: "DPF/MBA/PA", unidade: "UCAC/NUARM/DPF/MBA/PA" },
	{ sigla: "DPF/MCE/RJ", unidade: "UCAC/NUARM/DPF/MCE/RJ" },
	{ sigla: "DPF/MGA/PR", unidade: "UCAC/NUARM/DPF/MGA/PR" },
	{ sigla: "DPF/MII/SP", unidade: "UCAC/NUARM/DPF/MII/SP" },
	{ sigla: "DPF/MOC/MG", unidade: "UCAC/NUARM/DPF/MOC/MG" },
	{ sigla: "DPF/NIG/RJ", unidade: "UCAC/NUARM/DPF/NIG/RJ" },
	{ sigla: "DPF/NRI/RJ", unidade: "UCAC/NUARM/DPF/NRI/RJ" },
	{ sigla: "DPF/PAC/RR", unidade: "UCAC/NPA/DPF/PAC/RR" },
	{ sigla: "DPF/PAT/PB", unidade: "UCAC/NUARM/DPF/PAT/PB" },
	{ sigla: "DPF/PCA/SP", unidade: "UCAC/NUARM/DPF/PCA/SP" },
	{ sigla: "DPF/PDE/SP", unidade: "UCAC/NUARM/DPF/PDE/SP" },
	{ sigla: "DPF/PGZ/PR", unidade: "UCAC/NPA/DPF/PGZ/PR" },
	{ sigla: "DPF/PHB/PI", unidade: "UCAC/NPA/DPF/PHB/PI" },
	{ sigla: "DPF/PNG/PR", unidade: "UCAC/NPA/DPF/PNG/PR" },
	{ sigla: "DPF/PSO/BA", unidade: "DPF/PSO/BA" },
	{ sigla: "DPF/ROO/MT", unidade: "UCAC/NPA/DPF/ROO/MT" },
	{ sigla: "DPF/RPO/SP", unidade: "UCAC/NPA/DPF/RPO/SP" },
	{ sigla: "DPF/SAG/RS", unidade: "UCAC/NPA/DPF/SAG/RS" },
	{ sigla: "DPF/SBA/RS", unidade: "UCAC/NPA/DPF/SBA/RS" },
	{ sigla: "DPF/SIC/MT", unidade: "UCAC/NPA/DPF/SIC/MT" },
	{ sigla: "DPF/SMA/RS", unidade: "UCAC/NPA/DPF/SMA/RS" },
	{ sigla: "DPF/STM/ES", unidade: "UCAC/DPF/STM/ES" },
	{ sigla: "DPF/STS/SP", unidade: "UCAC/NUARM/DELEX/DPF/STS/SP" },
	{ sigla: "DPF/UDI/MG", unidade: "UCAC/NPA/DPF/UDI/MG" },
	{ sigla: "DPF/URA/MG", unidade: "UCAC/NPA/DPF/URA/MG" },
	{ sigla: "DPF/VRA/RJ", unidade: "UCAC/NUARM/DPF/VRA/RJ" },
	{ sigla: "SR/PF/AC", unidade: "UCAC/DELEARM/DREX/SR/PF/AC" },
	{ sigla: "SR/PF/AL", unidade: "UCAC/DELEARM/DREX/SR/PF/AL" },
	{ sigla: "SR/PF/AM", unidade: "UCAC/DELEARM/DREX/SR/PF/AM" },
	{ sigla: "SR/PF/AP", unidade: "UCAC/DELEARM/DREX/SR/PF/AP" },
	{ sigla: "SR/PF/BA", unidade: "UCAC/DELEARM/DREX/SR/PF/BA" },
	{ sigla: "SR/PF/CE", unidade: "UCAC/DELEARM/DREX/SR/PF/CE" },
	{ sigla: "SR/PF/DF", unidade: "UCAC/DELEARM/DREX/SR/PF/DF" },
	{ sigla: "SR/PF/ES", unidade: "UCAC/DELEARM/DREX/SR/PF/ES" },
	{ sigla: "SR/PF/GO", unidade: "UCAC/DELEARM/DREX/SR/PF/GO" },
	{ sigla: "SR/PF/MA", unidade: "UCAC/DELEARM/DREX/SR/PF/MA" },
	{ sigla: "SR/PF/MG", unidade: "UCAC/DELEARM/DREX/SR/PF/MG" },
	{ sigla: "SR/PF/MS", unidade: "DELEARM/DREX/SR/PF/MS" },
	{ sigla: "SR/PF/MT", unidade: "UCAC/DELEARM/DREX/SR/PF/MT" },
	{ sigla: "SR/PF/PA", unidade: "UCAC/DELEARM/DREX/SR/PF/PA" },
	{ sigla: "SR/PF/PB", unidade: "UCAC/DELEARM/DREX/SR/PF/PB" },
	{ sigla: "SR/PF/PE", unidade: "UCAC/DELEARM/DREX/SR/PF/PE" },
	{ sigla: "SR/PF/PI", unidade: "UCAC/DELEARM/DREX/SR/PF/PI" },
	{ sigla: "SR/PF/PR", unidade: "UCAC/DELEARM/DREX/SR/PF/PR" },
	{ sigla: "SR/PF/RJ", unidade: "UCAC/DELEARM/DREX/SR/PF/RJ" },
	{ sigla: "SR/PF/RN", unidade: "UCAC/DELEARM/DREX/SR/PF/RN" },
	{ sigla: "SR/PF/RO", unidade: "UCAC/DELEARM/DREX/SR/PF/RO" },
	{ sigla: "SR/PF/RR", unidade: "UCAC/DELEARM/DREX/SR/PF/RR" },
	{ sigla: "SR/PF/RS", unidade: "UCAC/DELEARM/DREX/SR/PF/RS" },
	{ sigla: "SR/PF/SC", unidade: "UCAC/DELEARM/DREX/SR/PF/SC" },
	{ sigla: "SR/PF/SE", unidade: "UCAC/DELEARM/DREX/SR/PF/SE" },
	{ sigla: "SR/PF/SP", unidade: "UCAC/DELEARM/DREX/SR/PF/SP" },
	{ sigla: "SR/PF/TO", unidade: "UCAC/DELEARM/DREX/SR/PF/TO" },
	{ sigla: "UCAC/JGO/RS", unidade: "UCAC/JGO/RS" },
] as const;

export type OmEnum = (typeof PF_OM_LIST)[number]["sigla"];
export const PF_OM_ENUM = PF_OM_LIST.map((om) => om.sigla) as OmEnum[];

export const PF_OM_LABELS: Record<OmEnum, string> = PF_OM_LIST.reduce(
	(acc, om) => {
		acc[om.sigla] = om.unidade;
		return acc;
	},
	{} as Record<OmEnum, string>,
);

export const PF_OM_OPTIONS = PF_OM_LIST.map(({ sigla, unidade }) => ({
	value: sigla as OmEnum,
	label: `${unidade}`,
}));

export function getOmLabel(om: OmEnum | string) {
	return PF_OM_LABELS[om as OmEnum] ?? om;
}

export const PROCESS_TYPE_ENUM = [
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
export type ProcessTypeEnum = (typeof PROCESS_TYPE_ENUM)[number];

export const PROCESS_TYPE_LABELS: Record<ProcessTypeEnum, string> = {
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
