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
exports.Logout = exports.Login = void 0;
const authServices_1 = require("./authServices");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const datos = req.body;
    const { status, message, token } = yield (0, authServices_1.login)(datos.username, datos.password);
    res.status(status).json({
        message,
        token,
    });
    next();
});
exports.Login = Login;
const Logout = (req, res) => { };
exports.Logout = Logout;
// export default Login;
