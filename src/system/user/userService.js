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
exports.validatePassword = exports.validateUser = exports.deleteUser = exports.createNewUser = exports.getUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../../helpers/index");
const prisma = new client_1.PrismaClient();
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    // El try cash lo qye hace es que no capta cualquier error que tengamos para que no se rompa 
    try {
        // Funciones que ara nuestro programa en caso de que todo salga bien 
        const user = yield prisma.user.findMany();
        //Validamos que lo que nos traiga la base de datos tenga algo aunquesea un primer usuario 
        if (user.length == 0) {
            return {
                message: `No hay usuarios encontrados`,
                status: 200,
                data: user,
            };
        }
        return {
            message: `Usuarios encontrado exitosamente`,
            status: 200,
            data: user,
        };
    }
    catch (error) {
        //Funcion que ara nuestro programa en caso de que se rompa le pasamos el paramtro errir y lo podemos retornar ak controller y mostrar por un console.log  
        console.log(error);
        return {
            message: `Contacte al administrador: error`,
            status: 500,
        };
    }
});
exports.getUsers = getUsers;
const getUser = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    //Usamos el try cash para captar cualquier error que tengamos y lo que podemos observar es que instancemos prisma y los usamos y accedemos a los datos que tenemos en la base de datos 
    try {
        const user = yield prisma.user.findMany({
            where: {
                id: dato,
            },
        });
        if (user.length == 0) {
            return {
                message: ``,
                status: 200,
                data: user,
            };
        }
        return {
            message: `Usuario encontrado exitosamente`,
            status: 200,
            data: user,
        };
    }
    catch (error) {
        console.log(error);
        //Usamos el template script para imprimir los errores o comillas inglesS 
        return {
            message: `Contacte con el administrador se encontror el error: ${error}`,
            status: 500,
        };
    }
});
exports.getUser = getUser;
const createNewUser = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(dato);
        const id = dato.id;
        const username = dato.username;
        const data = yield (0, exports.getUsers)();
        const validateEmail = (0, index_1.searchEmail)(data, dato.email);
        const validateID = (0, index_1.searchId)(data, dato.id);
        const validateUsername = (0, index_1.searchUsername)(data, dato.username);
        if (!validateEmail && !validateID && !validateUsername) {
            const user = yield prisma.user.create({
                data: {
                    id: dato.id,
                    email: dato.email,
                    username: dato.username,
                    password: dato.password,
                },
            });
            return {
                message: `El usuario fue registrado con exito`,
                status: 200,
                data: user,
            };
        }
        else {
            return {
                message: `Esos datos ya se encuentran registrado`,
                status: 200,
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            message: `Error contacte con el administrador`,
            status: 500,
        };
    }
});
exports.createNewUser = createNewUser;
const deleteUser = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, exports.getUsers)();
        const a = (0, index_1.searchId)(data["data"], dato);
        console.log(a);
        if (a) {
            const deleteuser = yield prisma.user.deleteMany({
                where: {
                    id: dato,
                },
            });
            return {
                message: `El usuario fue eliminado con exito`,
                status: 200,
            };
        }
        else {
            return {
                message: `El usuario no se encuentra registrado`,
                status: 200,
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            message: `Contacte con el administrador se encontror el error: ${error}`,
            status: 500,
        };
    }
});
exports.deleteUser = deleteUser;
const validateUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (user) {
            return {
                message: `Usuario encontrado`,
                status: 200,
                data: user,
            };
        }
        else {
            return {
                message: `Usuario no encontrado`,
                status: 404,
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            message: `Error contacte con el administrador`,
            status: 500,
        };
    }
});
exports.validateUser = validateUser;
const validatePassword = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (user && user.password === password) {
            return {
                message: `Contraseña válida`,
                status: 200,
                password: true
            };
        }
        else {
            return {
                message: `Contraseña incorrecta`,
                status: 401,
                password: false
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            message: `Error contacte con el administrador`,
            status: 500,
        };
    }
});
exports.validatePassword = validatePassword;
