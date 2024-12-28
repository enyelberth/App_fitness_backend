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
exports.updateAccountType = exports.createNewAccountType = exports.getAccountsType = exports.getAccountsTypes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAccountsTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield prisma.accountType.findMany();
        if (account.length == 0) {
            return {
                status: 200,
                message: `No se encontraron tipos de cuentas registradas`,
                data: account,
            };
        }
        else {
            return {
                message: `Tipos de Cuentas encontradas exitoxamente`,
                data: account,
                status: 200,
            };
        }
    }
    catch (error) {
        return {
            status: 500,
            message: `Error contacte con el administrador error: ${error}`,
        };
    }
});
exports.getAccountsTypes = getAccountsTypes;
const getAccountsType = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountType = yield prisma.accountType.findMany({
            where: {
                id: dato,
            },
        });
        if (accountType == undefined) {
            return {
                message: `No se encontro ese tipo de cuenta registrada`,
                status: 500,
            };
        }
        else {
            return {
                message: `El tipo de cuenta fue encontrado exitozamente`,
                status: 200,
                data: accountType,
            };
        }
    }
    catch (error) {
        return {
            message: ``,
            status: 500,
        };
    }
});
exports.getAccountsType = getAccountsType;
const createNewAccountType = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.accountType.create({
            data: {
                name: dato.name,
            },
        });
        return {
            message: `El type Account fue registrado correctamente`,
            status: 200,
            data: user,
        };
    }
    catch (error) {
        return {
            message: `Error contacte con el administrador`,
            status: 500,
        };
    }
});
exports.createNewAccountType = createNewAccountType;
const updateAccountType = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountType = yield prisma.accountType.create({
            data: {
                name: dato.name,
            },
        });
    }
    catch (error) {
        return {
            message: `Error contanct con el administrador`,
            stattus: 500,
        };
    }
});
exports.updateAccountType = updateAccountType;
