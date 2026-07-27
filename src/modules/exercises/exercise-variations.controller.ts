import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Roles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ExerciseVariationsService } from './exercise-variations.service';
import { CreateExerciseVariationDto } from './dto/create-exercise-variation.dto';

@ApiTags('exercises')
@Controller('exercises/:exerciseId/variations')
export class ExerciseVariationsController {
  constructor(private readonly variationsService: ExerciseVariationsService) {}

  @Get()
  getVariations(@Param('exerciseId') exerciseId: string) {
    return this.variationsService.getVariations(exerciseId);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createVariation(
    @Param('exerciseId') exerciseId: string,
    @Body() dto: CreateExerciseVariationDto,
  ) {
    return this.variationsService.createVariation(exerciseId, dto.name, dto.description);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.COACH)
  @Patch(':variationId')
  updateVariation(
    @Param('variationId') variationId: string,
    @Body() dto: CreateExerciseVariationDto,
  ) {
    return this.variationsService.updateVariation(variationId, dto.name, dto.description);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':variationId')
  deleteVariation(@Param('variationId') variationId: string) {
    return this.variationsService.deleteVariation(variationId);
  }
}
