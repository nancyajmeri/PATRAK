import express from "express";

import {
  login,
  changePassword,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.patch(
  "/change-password",
  protect,
  changePassword
);

export default router;