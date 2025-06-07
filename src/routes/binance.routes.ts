import Router, { Request, Response } from "express";
import { GetCurrencyBinance } from "../system/binance/binance.controller";
//import { GetCurrencyBinance } from "./binance.controller";
// import { CaptureOrder, CreateOrder } from "./index.controller";



const router = Router();

router.get("/",GetCurrencyBinance);

// router.get("/captureorder",CaptureOrder);

// router.get("/:cliente",GetAccountType);

// router.post("/", CreateNewAccountType);

export default router;
