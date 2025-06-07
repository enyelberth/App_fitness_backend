import Router,{ Request,Response } from "express";

import { CreateNewProduct, GetProducts } from "../modules/products/productController";
const router = Router();

router.get("/", GetProducts);

router.post("/",CreateNewProduct);

// router.post("/",product.createNewProduct);

router.patch("/:cliente", (_req: Request, res: Response) => {
  res.send("Update an existing workout");
});

router.delete("/:cliente", (_req:Request, res:Response) => {
  res.send("Delete an existing workout");
});
export default router;
