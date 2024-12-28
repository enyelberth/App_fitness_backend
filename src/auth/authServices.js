"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const userService_1 = require("../system/user/userService");
// import bcrypt from 'bcrypt';
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// import { getUserByUsername } from "./userService";
const secret = process.env.SECRET;
const login = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield (0, userService_1.validateUser)(username);
    if (!user) {
        return {
            status: 401,
            message: "Usuario no encontrado",
        };
    }
    const passwordd = (_a = user.data) === null || _a === void 0 ? void 0 : _a.password;
    //   console.log(passwordd);
    //   console.log(password);
    //   const isPasswordValid = await bcrypt.compare(String(password), String(passwordd));
    const validatepass = yield (0, userService_1.validatePassword)(username, password);
    //   console.log(da)
    //   bcrypt
    if (!validatepass.password) {
        return {
            status: 401,
            message: "Contraseña incorrecta",
        };
    }
    const token = jwt.sign({ username }, secret, { expiresIn: "1h" });
    return {
        status: 200,
        message: "El usuario ha iniciado sesión correctamente",
        token: token,
    };
});
exports.login = login;
const logout = (token) => {
    (token) => {
        // In a real-world application, you would invalidate the token by adding it to a blacklist
        // Here, we'll just return a success message for simplicity
        return {
            status: 200,
            message: "El usuario ha cerrado sesión correctamente",
        };
    };
    // Invalidate the token (this can be done by maintaining a blacklist of tokens)
    // For simplicity, we'll just return a success message
    return {
        status: 200,
        message: "El usuario ha cerrado sesión correctamente",
    };
};
exports.logout = logout;
