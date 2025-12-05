export type Om = {
	id: number;
	unit: string;
	email: string;
};

export type OmOption = {
	value: string;
	label: string;
};

export function toOmOption(om: Om): OmOption {
	return {
		value: String(om.id),
		label: om.unit,
	};
}
