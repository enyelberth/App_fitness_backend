import Router, { Request, Response } from "express";

import {
  GetAccountsTypes,
  CreateNewAccountType,
  GetAccountType,
} from "../controllers/accounTypeController";

// const product = require("../../controllers/productController");
const router = Router();

router.get("/", GetAccountsTypes);

router.get("/:cliente",GetAccountType);

router.post("/", CreateNewAccountType);
// router.delete("/", DeleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

export default router;
