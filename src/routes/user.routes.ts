import Router, { Request, Response } from "express";
import {
  GetUsers,
  CreateNewUser,
  DeleteUser,
  GetUser,
} from "../controllers/userController";
import { body, query } from "express-validator";
import { UserValidator } from "../validators";
import { Login } from "../auth/authControllers";
const router = Router();
const userValidator = new UserValidator();
router.get("/",...userValidator.validateUser, userValidator.verifyId, GetUsers);

router.get("/:cliente",GetUser);
router.post("/",CreateNewUser);
// router.delete("/:cliente", DeleteUser);





// router.post("/", userValidator.validateUser ,CreateNewUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

export default router;
