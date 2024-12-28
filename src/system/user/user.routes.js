"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("./userController");
const user_validators_1 = require("../../validators/user.validators");
const router = (0, express_1.default)();
router.get("/", userController_1.GetUsers);
router.get("/:cliente", userController_1.GetUser);
// Ruta para crear un nuevo usuario
router.post("/", user_validators_1.userValidator.validateUser.bind(user_validators_1.userValidator), userController_1.CreateNewUser);
exports.default = router;
