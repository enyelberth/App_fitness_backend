import express, { Request, Response } from "express";
import { GetUsers, CreateNewUser, DeleteUser } from "../controllers/userController";

import {
  GetAccountsType,
  CreateNewAccountType,
} from "../controllers/accounTypeController";

// const product = require("../../controllers/productController");
const router = express.Router();

router.get("/", GetAccountsType);

// router.get("/:cliente", (_req: Request, res: Response) => {
//   res.send("Hola esyo ess");
// });

router.post("/", CreateNewAccountType);
// router.delete("/", DeleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

module.exports = router;
