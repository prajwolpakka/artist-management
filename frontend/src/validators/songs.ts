import * as Yup from "yup";

export const songSchema = Yup.object().shape({
	artist_id: Yup.number().integer().positive().required("* Required"),
	title: Yup.string().required("* Required").max(255, "Title too long"),
	album_name: Yup.string().required("* Required").max(255, "Album name too long"),
	genre: Yup.mixed().oneOf(["rnb", "country", "classic", "rock", "jazz"], "Invalid genre").required("* Required"),
});
