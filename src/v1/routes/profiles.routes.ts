import express, { Request, Response } from "express";
import { GetUsers, CreateNewUser, DeleteUser } from "../../user/userController";
import { CreateNewProfile } from "../../user/profile/profileController";

// const product = require("../../controllers/productController");
const router = express.Router();

router.get("/", GetUsers);

// router.get("/:cliente", (_req: Request, res: Response) => {
//   res.send("Hola esyo ess");
// });

router.post("/", CreateNewProfile);
// router.delete("/", deleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

module.exports = router;
