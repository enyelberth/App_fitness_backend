"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subcategory_Controller_1 = require("../subCategoryProduct/subcategory.Controller");
const router = (0, express_1.default)();
router.get("/", subcategory_Controller_1.GetAllSubCategories);
router.post("/", subcategory_Controller_1.CreateSubCategory);
exports.default = router;
