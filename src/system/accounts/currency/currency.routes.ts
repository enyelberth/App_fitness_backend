import Router, { Request, Response } from "express";

import { CreateCurrency, GetCurrencys } from "./currencyController";
// const product = require("../../controllers/productController");
const router = Router();

router.get("/", GetCurrencys);

// router.get("/:cliente",GetAccountType);

router.post("/", CreateCurrency);

export default router;
