"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("./productController");
const router = (0, express_1.default)();
router.get("/", productController_1.GetProducts);
router.post("/", productController_1.CreateNewProduct);
// router.post("/",product.createNewProduct);
router.patch("/:cliente", (_req, res) => {
    res.send("Update an existing workout");
});
router.delete("/:cliente", (_req, res) => {
    res.send("Delete an existing workout");
});
exports.default = router;
