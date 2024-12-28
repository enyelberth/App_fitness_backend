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
exports.getData = exports.updateAccount = exports.createNewAccount = exports.getAccounts = exports.getAccount = void 0;
const client_1 = require("@prisma/client");
const userService_1 = require("../../system/user/userService");
const prisma = new client_1.PrismaClient();
const getAccount = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const accounts = await getAccount();
        const AccountIdArray = new Array();
        const profile = [1, 12];
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
exports.getAccount = getAccount;
const getAccounts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield prisma.account.findMany();
        if (account.length == 0) {
            return {
                status: 200,
                account,
                message: `No se encontraron cuentas registradas`,
            };
        }
        return {
            status: 200,
            account,
            message: `Las cuentas se encontraron exittazamente`
        };
    }
    catch (error) {
        return {
            message: `Erro contacte con el administrador ${error}`,
            status: 500
        };
    }
});
exports.getAccounts = getAccounts;
const createNewAccount = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, userService_1.getUsers)();
    // const typeAccount = await getAccountsType();
    const AccountId = yield (0, exports.getAccounts)();
    const AccountIdArray = new Array();
    const idUser = new Array();
    const idTypeaccount = new Array();
    const datos = dato;
    const id2 = dato.userId;
    const id3 = dato.typeId;
    const id4 = dato.id;
    // users.forEach((element) => {
    //   if (element.id) {
    //     idUser.push(element.id);
    //   }
    // });
    // typeAccount.forEach((element) => {
    //   if (element.id) {
    //     idTypeaccount.push(element.id);
    //   }
    // });
    // AccountId.forEach((element) => {
    //   if (element.id) {
    //     AccountIdArray.push(element.id);
    //   }
    // });
    const date = idUser.includes(id2);
    const date2 = idTypeaccount.includes(id3);
    const date3 = AccountIdArray.includes(id4);
    if (!date3 && date && date2) {
        const user = yield prisma.account.create({
            data: {
                id: datos.id,
                userId: datos.userId,
                typeId: datos.typeId,
            },
        });
        return user;
    }
    else if (!date) {
        return "El usuario no esta registrado";
    }
    else if (!date2) {
        return "la type de cuenta no esta registrado";
    }
    else if (date3) {
        return "El numero de cuenta ya esta utilazado";
    }
});
exports.createNewAccount = createNewAccount;
const updateAccount = (dato) => __awaiter(void 0, void 0, void 0, function* () {
    const datos = dato;
    const account = yield prisma.account.update({
        where: { id: "3" },
        data: { balance: -50 },
    });
    return "se update correctamente";
});
exports.updateAccount = updateAccount;
const getData = (searchOptions, limit, page) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getData = getData;
