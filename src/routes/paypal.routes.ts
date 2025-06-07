import Router, { Request, Response } from "express";
import { CreateOrder,CaptureOrder } from "../system/paypal/index.controller";



const router = Router();

router.get("/createorder", CreateOrder);

router.get("/captureorder", CaptureOrder);

// router.get("/:cliente",GetAccountType);

// router.post("/", CreateNewAccountType);

export default router;
