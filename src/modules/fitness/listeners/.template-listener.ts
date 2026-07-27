// TEMPLATE: Listener para Fitness
// Copiar y renombrar a: on-template-event.listener.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../../../events/event.bus';
import { TemplateService } from '../services/template.service';
import { TemplateCreatedEvent } from '../events/template.event';

/**
 * Listener: Escucha cuando Template es creado
 * Puede reaccionar emitiendo otros eventos o actualizando datos
 */
@Injectable()
export class OnTemplateCreatedListener implements OnModuleInit {
  constructor(
    private templateService: TemplateService,
    private eventBus: EventBusService,
  ) {}

  onModuleInit() {
    this.eventBus.on(TemplateCreatedEvent, (event) => this.handle(event));
  }

  private async handle(event: TemplateCreatedEvent) {
    console.log(`Template created: ${event.name}`);

    // Hacer algo con el evento
    // Ejemplo: Registrar en analytics, enviar email, etc
  }
}

/**
 * EJEMPLO REAL: Listener en Game que escucha WorkoutCompletedEvent
 *
 * @Injectable()
 * export class OnWorkoutCompletedListener implements OnModuleInit {
 *   constructor(
 *     private charactersService: CharactersService,
 *     private eventBus: EventBusService,
 *   ) {}
 *
 *   onModuleInit() {
 *     this.eventBus.on(WorkoutCompletedEvent, (event) => this.handle(event));
 *   }
 *
 *   private async handle(event: WorkoutCompletedEvent) {
 *     // Game reacciona cuando workout se completa
 *     await this.charactersService.awardXP(event.userId, event.xp);
 *
 *     // Posiblemente emitir otro evento
 *     const character = await this.charactersService.getCharacter(event.userId);
 *     if (character.levelsUp) {
 *       this.eventBus.emit(new CharacterLeveledUpEvent(...));
 *     }
 *   }
 * }
 */
