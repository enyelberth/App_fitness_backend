"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const binance_controller_1 = require("./binance.controller");
// import { CaptureOrder, CreateOrder } from "./index.controller";
const router = (0, express_1.default)();
router.get("/", binance_controller_1.GetCurrencyBinance);
// router.get("/captureorder",CaptureOrder);
// router.get("/:cliente",GetAccountType);
// router.post("/", CreateNewAccountType);
exports.default = router;
