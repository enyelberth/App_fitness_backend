import Router,{ Request,Response } from "express";

import { GetProducts } from "./productController";
const router = Router();

router.get("/", GetProducts);

router.get("/:product", (_req: Request, res: Response) => {
  res.send("Hola esyo ess");
});

// router.post("/",product.createNewProduct);

router.patch("/:cliente", (_req: Request, res: Response) => {
  res.send("Update an existing workout");
});

router.delete("/:cliente", (_req:Request, res:Response) => {
  res.send("Delete an existing workout");
});
export default router;
