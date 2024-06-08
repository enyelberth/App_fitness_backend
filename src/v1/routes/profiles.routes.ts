import express, { Request, Response } from "express";
import { GetUsers, CreateNewUser, deleteUser } from "../../user/userController";
import { createNewProfile } from "../../user/profile/profileServices";

// const product = require("../../controllers/productController");
const router = express.Router();

// router.get("/", GetUsers);

// router.get("/:cliente", (_req: Request, res: Response) => {
//   res.send("Hola esyo ess");
// });

router.post("/", createNewProfile);
// router.delete("/", deleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

module.exports = router;
