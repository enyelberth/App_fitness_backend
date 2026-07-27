// TEMPLATE: Repositorio para Fitness
// Copiar y renombrar a: workouts.repository.ts, exercises.repository.ts, etc

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TemplateRepository {
  constructor(private prisma: PrismaService) {}

  // CRUD básico
  async create(userId: string, data: any) {
    return this.prisma.PLACEHOLDER.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async findById(id: string, userId: string) {
    return this.prisma.PLACEHOLDER.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string, pagination?: { skip: number; take: number }) {
    return this.prisma.PLACEHOLDER.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      skip: pagination?.skip,
      take: pagination?.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, data: any) {
    return this.prisma.PLACEHOLDER.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.PLACEHOLDER.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async count(userId: string) {
    return this.prisma.PLACEHOLDER.count({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }
}
