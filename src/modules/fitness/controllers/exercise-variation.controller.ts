import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExerciseVariationService } from '../services/exercise-variation.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('exercise-variations')
@Controller('fitness/exercises/:exerciseId/variations')
export class ExerciseVariationController {
  constructor(private variationService: ExerciseVariationService) {}

  @Get()
  async getVariations(@Param('exerciseId') exerciseId: string) {
    return this.variationService.getVariations(exerciseId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async createVariation(
    @Param('exerciseId') exerciseId: string,
    @Body() body: { name: string; description?: string },
  ) {
    return this.variationService.createVariation(exerciseId, body.name, body.description);
  }

  @Patch(':variationId')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updateVariation(
    @Param('variationId') variationId: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.variationService.updateVariation(variationId, body.name, body.description);
  }

  @Delete(':variationId')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async deleteVariation(@Param('variationId') variationId: string) {
    return this.variationService.deleteVariation(variationId);
  }
}
