import Router, { request } from "express";
import { Request, Response } from "express";
import { CreateCategory, GetAllCategories } from "../modules/products/categoryProduct/category.Controller";

// import { CategoryProductService } from "./category.Service";
//import { CreateCategory, GetAllCategories } from "./category.Controller";
const router = Router();
// const categoryController =  new CategoryController();
router.get("/", GetAllCategories);
router.post("/", CreateCategory);

// router.get("/captureorder",CaptureOrder);

// router.get("/:cliente",GetAccountType);


export default router;
