"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userValidator = void 0;
const yup = __importStar(require("yup"));
// Definición del esquema de validación con Yup
const userSchema = yup.object().shape({
    password: yup.string().required("La contraseña es obligatoria."),
    email: yup.string().email("El email debe ser válido.").required("El email es obligatorio."),
    username: yup.string().required("El nombre de usuario es obligatorio."),
    id: yup.number().required("El id es obligatorio."),
});
class UserValidator {
    // Middleware para validar los datos del usuario
    validateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar los datos del cuerpo de la solicitud
                yield userSchema.validate(req.body);
                // Si la validación pasa, se llama a la siguiente función de middleware o controlador
                next();
            }
            catch (error) {
                // Manejo de errores de validación
                return res.status(400).json({
                    status: 400,
                    message: `Error en la validación: ${error}`,
                });
            }
        });
    }
}
exports.userValidator = new UserValidator();
