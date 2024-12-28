"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.CreateSubCategory = exports.getCategoryById = exports.GetAllSubCategories = void 0;
const subcategory_Service_1 = require("../subCategoryProduct/subcategory.Service");
const categoryService = new subcategory_Service_1.SubCategoryProductService();
const GetAllSubCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryService.findAll();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving categories", error });
    }
});
exports.GetAllSubCategories = GetAllSubCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const category = yield categoryService.findOne(parseInt(categoryId));
        if (category) {
            res.status(200).json(category);
        }
        else {
            res.status(404).json({ message: "Category not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving category", error });
    }
});
exports.getCategoryById = getCategoryById;
const CreateSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = req.body;
        const newCategory = yield categoryService.create(categoryData);
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
});
exports.CreateSubCategory = CreateSubCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
});
exports.updateCategory = updateCategory;
