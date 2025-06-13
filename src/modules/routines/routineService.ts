import { PrismaClient, Prisma } from "@prisma/client";
import { getOneMuscle } from './muscleController';



export class RoutineService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getRoutine() {
    try {
      const user = await this.prisma.rutina.findMany();

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
  async getOneRoutine(id: number) { 
    try {
      const muscle = await this.prisma.rutina.findFirst({
        where: {
          id: id,
        },
      });

      return {
        status: 200,
        data: muscle,
      };
    } catch (error) {
      return {
        status: 500,
        data: `Erro contacte con el administrador ${error}`,
      };
    }
  }
   async createNewRoutine(muscle: any) {
    try {
      if (!muscle.title || !muscle.description || !muscle.price || !muscle.quantity || !muscle.categoryMuscleId || !muscle.subCategoryMuscleId) {
        return {
          status: 400,
          data: "Todos los campos son requeridos",
        };
      }

      const producto = await this.prisma.rutina.create({
        data: {
     
          nombre: "Piernas",
        
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
