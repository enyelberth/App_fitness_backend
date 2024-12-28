import { Request, Response } from "express";
import { SubCategoryProductService } from "../subCategoryProduct/subcategory.Service";

const categoryService = new SubCategoryProductService();

export const GetAllSubCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.findAll();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryService.findOne(parseInt(categoryId));
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving category", error });
  }
};

export const CreateSubCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    const newCategory = await categoryService.create(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};
