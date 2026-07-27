import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CharacterService } from '../services/character.service';
import { CreateCharacterDto, CharacterResponseDto, LeaderboardEntryDto } from '../dto/character.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Game - Characters')
@Controller('game/characters')
export class CharacterController {
  constructor(private service: CharacterService) {}

  /**
   * POST - Crear nuevo personaje
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({ status: 201, type: CharacterResponseDto })
  async create(@CurrentUser() user: any, @Body() createDto: CreateCharacterDto) {
    return this.service.create(user.id, createDto);
  }

  /**
   * GET - Obtener mi personaje
   */
  @Get('me')
  @ApiOperation({ summary: 'Get my character' })
  @ApiResponse({ status: 200, type: CharacterResponseDto })
  async getMe(@CurrentUser() user: any) {
    return this.service.getMyCharacter(user.id);
  }

  /**
   * GET - Obtener personaje por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get character by ID' })
  @ApiResponse({ status: 200, type: CharacterResponseDto })
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  /**
   * GET - Leaderboard global
   */
  @Get()
  @ApiOperation({ summary: 'Get global leaderboard' })
  @ApiResponse({ status: 200, type: [LeaderboardEntryDto] })
  async getLeaderboard(@Query('limit') limit = 100) {
    return this.service.getLeaderboard(Math.min(limit, 1000));
  }

  /**
   * GET - Mi posición en leaderboard
   */
  @Get('leaderboard/rank')
  @ApiOperation({ summary: 'Get my leaderboard rank' })
  @ApiResponse({
    status: 200,
    schema: { example: { rank: 42 } },
  })
  async getMyRank(@CurrentUser() user: any) {
    return this.service.getMyRank(user.id);
  }
}
