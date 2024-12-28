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
exports.deleteUSer = exports.createNewUserAdmin = exports.getUsersAdmin = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsersAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findMany();
    return user;
});
exports.getUsersAdmin = getUsersAdmin;
const createNewUserAdmin = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = dato.email;
        const users = yield (0, exports.getUsersAdmin)();
        let correos = new Array();
        users.forEach((element) => {
            if (element.email) {
                correos.push(element.email);
            }
        });
        console.log(correos);
        const dat = correos.includes(email);
        console.log(dat);
        if (!dat) {
            const user = yield prisma.user.create({
                data: {
                    id: dato.id,
                    email: dato.email,
                    username: dato.email,
                    password: dato.email,
                },
            });
            console.log("REGISTRO");
            return true;
        }
        else {
            // console.log("El correo ya esta registrado");
            return false;
        }
        //   users.forEach((i) => {
    }
    catch (error) {
        console.error("Error al crear usuario ");
        // throw error;
    }
});
exports.createNewUserAdmin = createNewUserAdmin;
const getUserAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () { });
const deleteUSer = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = dato.email;
        let correos = new Array();
        const usuarios = yield (0, exports.getUsersAdmin)();
        usuarios.forEach((element) => {
            if (element.email) {
                correos.push(element.email);
            }
        });
        console.log(correos);
        const dat = correos.includes(email);
        if (dat) {
            const deleteuser = yield prisma.user.deleteMany({
                where: {
                    email: email,
                },
            });
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log("Error al eliminar el usuario");
    }
});
exports.deleteUSer = deleteUSer;
