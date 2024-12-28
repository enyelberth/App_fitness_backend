import Router, { request } from "express";
import { Request, Response } from "express";

import { CreateSubCategory, GetAllSubCategories } from "../subCategoryProduct/subcategory.Controller";
const router = Router();
router.get("/", GetAllSubCategories);
router.post("/", CreateSubCategory);

export default router;
