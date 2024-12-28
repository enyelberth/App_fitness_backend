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
exports.CategoryProductService = void 0;
const client_1 = require("@prisma/client");
class CategoryProductService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    create(createCategoryProductDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.categoryProduct.create({
                data: createCategoryProductDto,
            });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.prisma.categoryProduct.findMany();
                return {
                    status: 200,
                    data: category,
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
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dato = yield this.prisma.categoryProduct.findUnique({
                    where: { id },
                });
                return {
                    status: 200,
                    data: dato,
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
    update(id, updateCategoryProductDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.prisma.categoryProduct.update({
            //   where: { id },
            //   data: updateCategoryProductDto,
            // });
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.prisma.categoryProduct.delete({
            //   where: { id },
            // });
        });
    }
}
exports.CategoryProductService = CategoryProductService;
