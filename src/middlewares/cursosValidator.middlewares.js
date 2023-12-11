import { ZodError } from "zod";

export const cursosValidator = (schema) => (req, res, next) => {
	try {
		schema.parse({
			body: req.body,
		});
		next();
	} catch (error) {
		if (error instanceof ZodError) {
			return res.json(
				error.issues.map((issue) => ({
					path: issue.path,
					message: issue.message,
				}))
			);
		}
		return res.status(500).json({ message: "internal server error" });
	}
};
