import Router, { Request, Response } from "express";
import {
  GetUsers,
  CreateNewUser,
  DeleteUser,
} from "../controllers/userController";

const router = Router();
router.get("/", GetUsers);

// router.get("/:cliente",GetUsers);

router.post("/", CreateNewUser);
router.delete("/", DeleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

export default router;
