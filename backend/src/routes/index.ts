import express from "express";
import container from "../container/inversify.config";
import { CategoryController } from "../controllers/CategoryController";
import { QuestionController } from "../controllers/QuestionController";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../middlewares/AuthMiddleware";
import { UserController } from "../controllers/UserController";
import authRoutes from "./auth.routes";

const router = express.Router();
const categoryController = container.get(CategoryController);
const questionController = container.get(QuestionController);
const authController = container.get(AuthController);
const userController = container.get(UserController);

router.post("/categories", asyncHandler(categoryController.create));
router.get("/categories", asyncHandler(categoryController.getAll));
router.get("/categories/:id", asyncHandler(categoryController.getById));
router.put("/categories/:id", asyncHandler(categoryController.update));
router.delete("/categories/:id", categoryController.delete);

router.post("/questions", asyncHandler(questionController.create));
router.get("/questions", asyncHandler(questionController.getAll));
router.get("/questions/:id", asyncHandler(questionController.getById));
router.put("/questions/:id", asyncHandler(questionController.update));
router.delete("/questions/:id", asyncHandler(questionController.delete));

router.post("/auth/login", asyncHandler(authController.login));
router.get("/menu", authenticateToken, (_req, res) => {
  res.json({ message: "Bem-vindo ao menu do administrador!" });
});

router.post(
  "/adm/update-password",
  authenticateToken,
  asyncHandler(userController.updatePassword)
);

export default router;
