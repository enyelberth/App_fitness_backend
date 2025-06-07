import Router, { Request, Response } from "express";
import { CreateCurrency, GetCurrency } from "../system/accounts/currency/currencyController";

//import { CreateCurrency, GetCurrencys } from "./currencyController";
// const product = require("../../controllers/productController");
const router = Router();

router.get("/", GetCurrency);

// router.get("/:cliente",GetAccountType);

router.post("/", CreateCurrency);

export default router;
