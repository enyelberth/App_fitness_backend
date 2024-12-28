"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountController_1 = require("../controllers/accountController");
// import { getAccount } from "../services/accounts/accountService";
// const product = require("../../controllers/productController");
const router = (0, express_1.default)();
router.get("/", accountController_1.GetAccounts);
// router.get("/", GetAccount);
// router.get("/:id",GetAccount);
// router.post("/", CreateNewAccount);
// router.put("/", UpdateAccount);
// router.delete("/", DeleteUser);
// router.patch("/:cliente", (_req: Request, res: Response) => {s
//   res.send("Update an existing workout");
// });
// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });
exports.default = router;
