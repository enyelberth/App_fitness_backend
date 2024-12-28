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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const userDate = [
    { id: 30204334, username: 'enyelberth10', email: 'enyelberthrc22.z@gmail.com', password: '30204334' },
    { id: 210294, username: 'enyelberth11', email: 'enyelberthrc11.z@gmail.com', password: '30204334' },
    { id: 18057999, username: 'enyelberth12', email: 'enyelberthrc12.z@gmail.com', password: '30204334' },
    { id: 14334066, username: 'enyelberth13', email: 'enyelberthrc13.z@gmail.com', password: '30204334' },
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Opcional: limpiar antes de sembrar
        yield prisma.user.deleteMany();
        // Crear los registros
        for (const user of userDate) {
            yield prisma.user.create({
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                }
            });
        }
        console.log('Datos sembrados correctamente.');
    });
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
