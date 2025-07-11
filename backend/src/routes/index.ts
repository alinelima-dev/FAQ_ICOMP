import express from "express";
import container from "../container/inversify.config";
import { CategoryController } from "../controllers/CategoryController";
import { QuestionController } from "../controllers/QuestionController";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthController } from "../controllers/AuthController";
import { authenticateToken } from "../middlewares/AuthMiddleware";
import { UserController } from "../controllers/UserController";
import authRoutes from "./auth.routes";
import { upload } from "../config/multerConfig";
import path from "path";
import { SuggestionController } from "../controllers/SuggestionController";
import { PasswordResetController } from "../controllers/PasswordController";
import TYPES from "../types";

const router = express.Router();
const categoryController = container.get(CategoryController);
const questionController = container.get(QuestionController);
const authController = container.get(AuthController);
const userController = container.get(UserController);
const suggestionController = container.get(SuggestionController);
const passwordController = container.get<PasswordResetController>(
  TYPES.PasswordResetController
);

router.post("/categories", asyncHandler(categoryController.create));
router.get("/categories", asyncHandler(categoryController.getAll));
router.get("/categories/:id", asyncHandler(categoryController.getById));
router.put("/categories/:id", asyncHandler(categoryController.update));
router.delete("/categories/:id", categoryController.delete);

router.post(
  "/questions",
  upload.array("attachments"),
  asyncHandler(questionController.create)
);
router.get("/questions", asyncHandler(questionController.getAll));
router.get("/questions/:id", asyncHandler(questionController.getById));
router.put(
  "/questions/:id",
  upload.array("attachments"),
  asyncHandler(questionController.update)
);
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

router.get("/attachments/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve("uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Erro ao baixar o arquivo:", err);
      res.status(404).json({ error: "Arquivo não encontrado" });
    }
  });
});

router.post("/suggestions", asyncHandler(suggestionController.create));
router.get("/suggestions", asyncHandler(suggestionController.getAll));

router.post(
  "/auth/request-reset",
  asyncHandler(passwordController.requestReset)
);
router.post(
  "/auth/reset-password",
  asyncHandler(passwordController.resetPassword)
);

export default router;
