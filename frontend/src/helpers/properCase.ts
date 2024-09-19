export const properCase = (value: string | null | undefined): string => {
	if (!value) return "";
	return value.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
};
