import { PrismaClient, Prisma } from "@prisma/client";
export class SubCategoryProductService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createCategoryProductDto: any) {
    return this.prisma.subCategoryProduct.create({
      data: createCategoryProductDto,
    });
  }

  async findAll() {
    try {
      const category = await this.prisma.subCategoryProduct.findMany();
      return {
        status: 200,
        data: category,
      };
    
    } catch (error) {
      return {
        status: 500,
        data: `Error ${error} contacte con el administrador`,
      };
    }
  }

  async findOne(id: number) {
    try {
      const dato = await this.prisma.subCategoryProduct.findUnique({
        where: { id },
      });
      return {
        status: 200,
        data: dato,
      };
    } catch (error) {
      return {
        status: 500,
        data: `Error ${error} contacte con el administrador`,
      };
    }
  }

  async update(id: string, updateCategoryProductDto: any) {
    // return this.prisma.categoryProduct.update({
    //   where: { id },
    //   data: updateCategoryProductDto,
    // });
  }

  async remove(id: string) {
    // await this.prisma.categoryProduct.delete({
    //   where: { id },
    // });
  }
}
