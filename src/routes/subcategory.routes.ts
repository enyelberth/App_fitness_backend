import Router, { request } from "express";
import { Request, Response } from "express";
import { GetAllSubCategories,CreateSubCategory } from "../modules/products/subCategoryProduct/subcategory.Controller";

//import { CreateSubCategory, GetAllSubCategories } from "../subCategoryProduct/subcategory.Controller";
const router = Router();
router.get("/", GetAllSubCategories);
router.post("/", CreateSubCategory);

export default router;
