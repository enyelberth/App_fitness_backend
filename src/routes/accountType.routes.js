"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accounTypeController_1 = require("../controllers/accounTypeController");
// const product = require("../../controllers/productController");
const router = (0, express_1.default)();
router.get("/", accounTypeController_1.GetAccountsTypes);
router.get("/:cliente", accounTypeController_1.GetAccountType);
router.post("/", accounTypeController_1.CreateNewAccountType);
exports.default = router;
