import Router, { NextFunction, Request, Response } from "express";
import {
  GetUsers,
  CreateNewUser,
  DeleteUser,
  GetUser,
} from "./userController";
import { userValidator } from "../../validators/user.validators";

const router = Router();

router.get("/", GetUsers);
router.get("/:cliente", GetUser);

// Ruta para crear un nuevo usuario
router.post("/", userValidator.validateUser.bind(userValidator), CreateNewUser);

export default router;
