import Router, { NextFunction, Request, Response } from "express";
import {
  GetUsers,
  CreateNewUser,
  DeleteUser,
  GetUser,
} from "../controllers/userController";
import { userValidator } from "../validators/user.validators";

const router = Router();

// Rutas
router.get("/", GetUsers);
router.get("/:cliente", GetUser);

// Ruta para crear un nuevo usuario
router.post("/", userValidator.validateUser.bind(userValidator), CreateNewUser);

export default router;
