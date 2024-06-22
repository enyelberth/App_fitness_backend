import express, { Request, Response } from "express";

import { CreateNewAccount,GetAccounts,GetAccount,UpdateAccount } from "../controllers/accountController";
import { getAccount } from "../services/accountService";
// const product = require("../../controllers/productController");
const router = express.Router();

// router.get("/", GetAccounts);
// router.get("/", GetAccount);
router.get("/:id",GetAccount);

router.post("/", CreateNewAccount);
router.put("/", UpdateAccount);
// router.delete("/", DeleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

module.exports = router;
