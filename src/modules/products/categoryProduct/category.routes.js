"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { CategoryProductService } from "./category.Service";
const category_Controller_1 = require("./category.Controller");
const router = (0, express_1.default)();
// const categoryController =  new CategoryController();
router.get("/", category_Controller_1.GetAllCategories);
router.post("/", category_Controller_1.CreateCategory);
// router.get("/captureorder",CaptureOrder);
// router.get("/:cliente",GetAccountType);
exports.default = router;
