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
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
class ProductService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.prisma.product.findMany();
                return {
                    status: 200,
                    data: user,
                };
            }
            catch (error) {
                return {
                    status: 500,
                    data: `Error ${error} contacte con el administrador`,
                };
            }
            finally {
                yield this.prisma.$disconnect(); // Cerrar conexión
            }
        });
    }
    getOneProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.prisma.product.findFirst({
                    where: {
                        id: id,
                    },
                });
                return {
                    status: 200,
                    data: product,
                };
            }
            catch (error) {
                return {
                    status: 500,
                    data: `Erro contacte con el administrador ${error}`,
                };
            }
        });
    }
    createNewProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!product.title || !product.description || !product.price || !product.quantity || !product.categoryProductId || !product.subCategoryProductId) {
                    return {
                        status: 400,
                        data: "Todos los campos son requeridos",
                    };
                }
                const producto = yield this.prisma.product.create({
                    data: {
                        title: String(product.title),
                        description: String(product.description),
                        price: Number(product.price),
                        quantity: Number(product.quantity),
                        categoryProductId: Number(product.categoryProductId),
                        subCategoryProductId: Number(product.subCategoryProductId),
                    },
                });
                return {
                    status: 200,
                    data: producto,
                };
            }
            catch (error) {
                return {
                    status: 500,
                    data: `Error ${error} contacte con el administrador`,
                };
            }
        });
    }
}
exports.ProductService = ProductService;
