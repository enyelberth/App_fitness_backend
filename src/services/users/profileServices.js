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
exports.createNewProfile = exports.getProfiles = exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const userService_1 = require("../../system/user/userService");
const index_1 = require("../../helpers/index");
const prisma = new client_1.PrismaClient();
const getProfile = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield prisma.profile.findMany({
            where: {
                id: dato,
            },
        });
        if (profile.length == 0) {
            return {
                message: `El perfil no se encontro registrado`,
                status: 200,
                data: profile,
            };
        }
        return {
            message: `Perfil encontrado exitosamente`,
            status: 200,
            data: profile,
        };
    }
    catch (error) {
        console.log(error);
        return {
            message: `Contacte con el administrador se encontror el error: ${error}`,
            status: 500,
        };
    }
});
exports.getProfile = getProfile;
const getProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield prisma.profile.findMany();
        if (profile.length == 0) {
            return {
                message: `No hay usuarios encontrados`,
                status: 200,
                data: profile,
            };
        }
        return {
            message: `Usuarios encontrado exitosamente`,
            status: 200,
            data: profile,
        };
    }
    catch (error) {
        console.log(error);
        return {
            message: `Contacte al administrador: error`,
            status: 500,
        };
    }
});
exports.getProfiles = getProfiles;
const createNewProfile = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Array de datos
        console.log("Datos de la creacion de perfil");
        const profiles = yield (0, exports.getProfiles)();
        const user = yield (0, userService_1.getUsers)();
        //Buscar los elementos
        const validateId = yield (0, index_1.search)(profiles, { id: dato.id });
        const validatPhone = yield (0, index_1.search)(profiles, { phone: dato.phone });
        const validateUsers = yield (0, index_1.searchId)(user, dato.userId);
        console.log(validateId);
        //Validate SI el usuario existe 
        if (validateUsers) {
            if (validateId) {
                return {
                    status: 200,
                    message: `El id ya esta registrado en otro perfil`,
                };
            }
            const profile = yield prisma.profile.create({
                data: {
                    firstName: dato.firstName,
                    lastName: dato.username,
                    dob: new Date("2023-12-03"),
                    address: dato.password,
                    phone: dato.phone,
                    userId: dato.id,
                },
            });
            return {
                message: `El profile se registro correctamente`,
                status: 200,
            };
        }
        else {
            // Si no existe retorna esto
            return {
                message: `No se pudo encontrar ningun usuario con ese id`,
                status: 200,
            };
        }
    }
    catch (error) {
        //Encaso que alla un error imprime esto
        console.log(`Error contacte con el administrador ${error}`);
        return {
            message: `Error contacte con el administrador ${error}`,
            status: 500,
        };
    }
});
exports.createNewProfile = createNewProfile;
