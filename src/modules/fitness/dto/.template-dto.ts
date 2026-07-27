// TEMPLATE: DTOs para Fitness
// Copiar y renombrar a: create-workout.dto.ts, update-workout.dto.ts, etc

import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// CREATE DTO
export class CreateTemplateDto {
  @ApiProperty({
    description: 'Nombre',
    example: 'Workout A',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción (opcional)',
    example: 'Mi primer workout',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

// UPDATE DTO (Todos los campos opcionales)
export class UpdateTemplateDto {
  @ApiProperty({
    description: 'Nombre (opcional)',
    example: 'Workout A Updated',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción (opcional)',
    example: 'Descripción actualizada',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

// RESPONSE DTO
export class TemplateResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
