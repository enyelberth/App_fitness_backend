import { PrismaClient, Prisma } from "@prisma/client";



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
  async createNewProduct(product: any) {
    try {
      if (!product.title || !product.description || !product.price || !product.quantity || !product.categoryProductId || !product.subCategoryProductId) {
        return {
          status: 400,
          data: "Todos los campos son requeridos",
        };
      }

      const producto = await this.prisma.product.create({
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
    } catch (error) {
      return {
        status: 500,
        data: `Error ${error} contacte con el administrador`,
      };
    }
  }
}
