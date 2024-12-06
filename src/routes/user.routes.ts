import Router, { Request, Response } from "express";
import {
  GetUsers,
  CreateNewUser,
  DeleteUser,
  GetUser,
} from "../controllers/userController";
import { body, query } from "express-validator";
import { UserValidator, signUpCheck} from "../validators";
import { Login } from "../auth/authControllers";

const router = Router();

const createEmailChain = () => body('email').isEmail();

// const userValidator = new UserValidator();
router.get("/", signUpCheck(),GetUsers);
router.get("/:cliente", GetUser);
router.post("/", CreateNewUser);

export default router;
