import Router, { Request, Response } from "express";
import { CreateTransaction, GetTransactions } from "../system/accounts/transaction/transactionController";

//import { CreateTransaction, GetTransaction, GetTransactions } from "../transactionController";
const router = Router();

router.get("/", GetTransactions);

// router.get("/:cliente",GetAccountType);

router.post("/", CreateTransaction);

export default router;
