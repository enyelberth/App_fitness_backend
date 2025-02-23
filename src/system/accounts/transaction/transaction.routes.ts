import Router, { Request, Response } from "express";

import { CreateTransaction, GetTransaction } from "./transactionController";
const router = Router();

router.get("/", GetTransaction);

// router.get("/:cliente",GetAccountType);

router.post("/", CreateTransaction);

export default router;
