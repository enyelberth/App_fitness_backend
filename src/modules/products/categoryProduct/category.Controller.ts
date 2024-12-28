import { Request, Response } from "express";
import { CategoryProductService } from "./category.Service";

const categoryService = new CategoryProductService();


export const  GetAllCategories =async (req: Request, res: Response)=> {
    try {
      const categories = await categoryService.findAll();

      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving categories", error });
    }
  }
export const  getCategoryById = async(req: Request, res: Response) =>{
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
  }

export const CreateCategory =  async(req: Request, res: Response)=>{
    try {
      const categoryData = req.body;
      const newCategory = await categoryService.create(
        categoryData
      );
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: "Error creating category", error });
    }
  }

  export const updateCategory = async (req: Request, res: Response)=> {
    try {
    //   const categoryId = req.params.id;
    //   const categoryData = req.body;
    //   const updatedCategory = await this.categoryService.updateCategory(
    //     categoryId,
    //     categoryData
    //   );
    //   if (updatedCategory) {
    //     res.status(200).json(updatedCategory);
    //   } else {
    //     res.status(404).json({ message: "Category not found" });
    //   }
    } catch (error) {
      res.status(500).json({ message: "Error updating category", error });
    }
  }

//   public async deleteCategory(req: Request, res: Response): Promise<void> {
    // try {
    //   const categoryId = req.params.id;
    //   const deleted = await this.categoryService.deleteCategory(categoryId);
    //   if (deleted) {
    //     res.status(200).json({ message: "Category deleted successfully" });
    //   } else {
    //     res.status(404).json({ message: "Category not found" });
    //   }
    // } catch (error) {
    //   res.status(500).json({ message: "Error deleting category", error });
    // }
//   }

