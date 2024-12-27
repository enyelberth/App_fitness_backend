import { PrismaClient, Prisma } from "@prisma/client";

interface Product {
  title: string;
  description: string;
  price: number;
  quantity: number;
  categoryProductId?: number;
  subCategoryProductId?: number;
}

export class ProductService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getProducts() {
    try {
      const user = await this.prisma.product.findMany();

      return {
        status: 200,
        data: user,
      };
    } catch (error) {
      return {
        status: 500,
        data: `Error ${error} contacte con el administrador`,
      };
    } finally {
      await this.prisma.$disconnect(); // Cerrar conexión
    }
  }
  async getOneProduct(id: number) {
    try {
      const product = await this.prisma.product.findFirst({
        where: {
          id: id,
        },
      });

      return {
        status: 200,
        data: product,
      };
    } catch (error) {
      return {
        status: 500,
        data: `Erro contacte con el administrador ${error}`,
      };
    }
  }
  async createNewProduct(product: Product) {
    const producto = await this.prisma.product.create({
      data: {
        title: product.title,
        price: parseInt(product.price),
        quantity: product.quantity,
        categoryProductId: product.categoryProductId,
        subCategoryProductId: product.subCategoryProductId,
      },
    });
    return {
      status: 200,
      data: producto,
    };
  }
}
