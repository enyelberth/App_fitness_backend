import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EndSessionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
