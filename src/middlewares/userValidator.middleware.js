import { ZodError } from "zod";

export const userValidator = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(
        error.issues.map((issue)=>({
            path: issue.path,
            message: issue.message,
        }))
      );
    }
    return res.status(400).json({message: "internal server error"})
  }
};
