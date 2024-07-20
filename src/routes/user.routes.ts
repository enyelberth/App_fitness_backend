import Router, { Request, Response } from "express";
import {
  GetUsers,
  CreateNewUser,
  DeleteUser,
} from "../controllers/userController";

import { UserValidator } from "../validators";
const router = Router();
const userValidator = new UserValidator();
router.get("/", GetUsers);

// router.get("/:cliente",GetUsers);

router.post("/", userValidator.validateUser ,CreateNewUser);
// router.delete("/", DeleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

export default router;
