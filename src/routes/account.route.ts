import Router, { Request, Response } from "express";
//import { CreateNewAccount,GetAccounts,GetAccount,UpdateAccount } from "../accountController";
import { CreateNewAccount,GetAccounts,GetAccount,UpdateAccount } from "../system/accounts/accountController";
// import { getAccount } from "../services/accounts/accountService";
// const product = require("../../controllers/productController");
const router = Router();

router.get("/", GetAccounts);
// router.get("/", GetAccount);
// router.get("/:id",GetAccount);

router.post("/", CreateNewAccount);
// router.put("/", UpdateAccount);
// router.delete("/", DeleteUser);
// router.patch("/:cliente", (_req: Reques
// t, res: Response) => {s
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

export default router;
