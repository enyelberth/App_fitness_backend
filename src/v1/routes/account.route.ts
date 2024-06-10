import express, { Request, Response } from "express";
import { GetUsers, CreateNewUser, DeleteUser } from "../../user/userController";

import { CreateNewAccount,GetAccounts } from "../../user/account/accountController";
// const product = require("../../controllers/productController");
const router = express.Router();

router.get("/", GetAccounts);

// router.get("/:cliente", (_req: Request, res: Response) => {
//   res.send("Hola esyo ess");
// });

router.post("/", CreateNewAccount);
// router.delete("/", DeleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

module.exports = router;
