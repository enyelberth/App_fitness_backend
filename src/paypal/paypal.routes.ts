import Router, { Request, Response } from "express";
import { CaptureOrder, CreateOrder } from "./index.controller";



const router = Router();

router.get("/createorder",CreateOrder);

router.get("/captureorder",CaptureOrder);

// router.get("/:cliente",GetAccountType);

// router.post("/", CreateNewAccountType);

export default router;
