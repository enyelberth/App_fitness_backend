import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  exports: [PassportModule],
})
export class CommonModule {}
