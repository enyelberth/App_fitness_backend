// TEMPLATE: Controlador para Fitness
// Copiar y renombrar a: workouts.controller.ts, exercises.controller.ts, etc

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { TemplateService } from '../services/template.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('fitness-template')
@Controller('fitness/template')
export class TemplateController {
  constructor(private service: TemplateService) {}

  // POST - Crear
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: any, @Body() createDto: CreateTemplateDto) {
    return this.service.create(user.id, createDto);
  }

  // GET - Listar todos
  @Get()
  async list(@CurrentUser() user: any, @Query() pagination: PaginationDto) {
    return this.service.listByUser(user.id, pagination.skip, pagination.take);
  }

  // GET - Obtener por ID
  @Get(':id')
  async getById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.getById(id, user.id);
  }

  // PATCH - Actualizar
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateDto: UpdateTemplateDto,
  ) {
    return this.service.update(id, user.id, updateDto);
  }

  // DELETE - Eliminar
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.delete(id, user.id);
  }
}
