// TEMPLATE: Servicio para Fitness
// Copiar y renombrar a: workouts.service.ts, exercises.service.ts, etc

import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';
import { TemplateRepository } from '../repositories/template.repository';

@Injectable()
export class TemplateService {
  constructor(
    private repository: TemplateRepository,
    private eventBus: EventBusService,
  ) {}

  // Crear
  async create(userId: string, createDto: any) {
    const item = await this.repository.create(userId, createDto);

    // EMITIR evento si es necesario
    // this.eventBus.emit(new TemplateCreatedEvent(...));

    return item;
  }

  // Obtener por ID
  async getById(id: string, userId: string) {
    const item = await this.repository.findById(id, userId);
    if (!item) throw new NotFoundException(`Item not found`);
    return item;
  }

  // Listar todos del usuario
  async listByUser(userId: string, skip = 0, take = 10) {
    const [items, total] = await Promise.all([
      this.repository.findByUserId(userId, { skip, take }),
      this.repository.count(userId),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        hasMore: skip + take < total,
      },
    };
  }

  // Actualizar
  async update(id: string, userId: string, updateDto: any) {
    await this.getById(id, userId);

    const updated = await this.repository.update(id, userId, updateDto);

    // EMITIR evento si es necesario
    // this.eventBus.emit(new TemplateUpdatedEvent(...));

    return updated;
  }

  // Eliminar
  async delete(id: string, userId: string) {
    await this.getById(id, userId);

    const deleted = await this.repository.delete(id, userId);

    // EMITIR evento si es necesario
    // this.eventBus.emit(new TemplateDeletedEvent(...));

    return { success: true };
  }
}
