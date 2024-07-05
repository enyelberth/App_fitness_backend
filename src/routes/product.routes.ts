import Router,{ Request,Response } from "express";

const product = require("../controllers/productController");
const router = Router();

router.get("/", product.getProducts);

router.get("/:cliente", (_req: Request, res: Response) => {
  res.send("Hola esyo ess");
});

router.post("/",product.createNewProduct);

router.patch("/:cliente", (_req: Request, res: Response) => {
  res.send("Update an existing workout");
});

router.delete("/:cliente", (_req:Request, res:Response) => {
  res.send("Delete an existing workout");
});
export default router;
