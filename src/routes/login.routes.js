import { Router } from "express";
import { tryLogin } from "../controllers/login.controller.js";
import { userValidator } from "../middlewares/userValidator.middleware.js";
import { loginUserSchema } from "../schemas/user.schemas.js";

const loginRouter = Router();

loginRouter.post("/api/login", userValidator(loginUserSchema), tryLogin);
loginRouter.get("/api/login");

export default loginRouter;
