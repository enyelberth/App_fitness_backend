import { Module } from '@nestjs/common';
import { EventBusService } from './event.bus';

@Module({
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventsModule {}
