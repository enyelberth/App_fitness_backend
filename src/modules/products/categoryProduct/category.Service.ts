import { PrismaClient, Prisma } from "@prisma/client";
export class CategoryProductService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createCategoryProductDto: any) {
    return this.prisma.categoryProduct.create({
      data: createCategoryProductDto,
    });
  }

  async findAll() {
    try {
      const category = await this.prisma.categoryProduct.findMany();
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
      const dato = await this.prisma.categoryProduct.findUnique({
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
