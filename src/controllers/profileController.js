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
exports.CreateNewProfile = exports.GetProfile = exports.GetProfiles = void 0;
const profileServices_1 = require("../services/users/profileServices");
const GetProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status, message } = yield (0, profileServices_1.getProfiles)();
    console.log("obteniendo Perfiles");
    return res.status(status).json({
        message,
        data,
    });
});
exports.GetProfiles = GetProfiles;
const GetProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const {cliente} = req.params;
});
exports.GetProfile = GetProfile;
const CreateNewProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("dato");
        const dato = req.body;
        const { message, status } = yield (0, profileServices_1.createNewProfile)(dato);
        return res.status(status).json({
            message,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error contacte con el administrador",
            status: 500,
        });
    }
});
exports.CreateNewProfile = CreateNewProfile;
