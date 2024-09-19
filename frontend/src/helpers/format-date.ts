const padZero = (num: number) => (num < 10 ? `0${num}` : num.toString());

const formatDateToYMD = (date: Date): string => {
	const year = date.getFullYear();
	const month = padZero(date.getMonth() + 1);
	const day = padZero(date.getDate());
	return `${year}-${month}-${day}`;
};

export const formatDateTimeToYMD = (dateTime?: Date): string => {
	const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

	if (!date || isNaN(date.getTime())) return "";

	return formatDateToYMD(date);
};
