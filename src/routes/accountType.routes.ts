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

export default router;
