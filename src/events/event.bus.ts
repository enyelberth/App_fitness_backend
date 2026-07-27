import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

/**
 * Event Bus Central
 * Maneja la comunicación entre módulos sin acoplamiento
 *
 * Uso:
 * this.eventBus.emit(new WorkoutCompletedEvent(...));
 * this.eventBus.on(WorkoutCompletedEvent, (event) => {...});
 */
@Injectable()
export class EventBusService {
  private eventEmitter = new EventEmitter2({
    wildcard: false,
    maxListeners: 100,
  });

  /**
   * Emitir un evento
   * @param event - Instancia del evento
   */
  emit<T>(event: T): void {
    const eventName = event.constructor.name;
    this.eventEmitter.emit(eventName, event);
  }

  /**
   * Escuchar un evento
   * @param eventClass - Clase del evento
   * @param handler - Función handler
   */
  on<T>(
    eventClass: new (...args: any[]) => T,
    handler: (event: T) => void | Promise<void>,
  ): void {
    const eventName = eventClass.name;
    this.eventEmitter.on(eventName, handler);
  }

  /**
   * Escuchar una sola vez
   */
  once<T>(
    eventClass: new (...args: any[]) => T,
    handler: (event: T) => void | Promise<void>,
  ): void {
    const eventName = eventClass.name;
    this.eventEmitter.once(eventName, handler);
  }

  /**
   * Dejar de escuchar
   */
  off<T>(
    eventClass: new (...args: any[]) => T,
    handler: (event: T) => void | Promise<void>,
  ): void {
    const eventName = eventClass.name;
    this.eventEmitter.off(eventName, handler);
  }

  /**
   * Obtener listeners registrados para un evento
   */
  listenerCount<T>(eventClass: new (...args: any[]) => T): number {
    const eventName = eventClass.name;
    return this.eventEmitter.listenerCount(eventName);
  }
}
