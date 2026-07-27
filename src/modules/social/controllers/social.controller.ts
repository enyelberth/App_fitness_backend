import { Controller, Post, Get, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SocialService } from '../services/social.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('social')
@Controller('social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Post('follow/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async followUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
  ) {
    return this.socialService.followUser(user.id, userId);
  }

  @Delete('follow/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async unfollowUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
  ) {
    return this.socialService.unfollowUser(user.id, userId);
  }

  @Get('followers/:userId')
  @Public()
  async getFollowers(@Param('userId') userId: string) {
    return this.socialService.getFollowers(userId);
  }

  @Get('following/:userId')
  @Public()
  async getFollowing(@Param('userId') userId: string) {
    return this.socialService.getFollowing(userId);
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getRecommendedUsers(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit: string = '10',
  ) {
    return this.socialService.getRecommendedUsers(user.id, parseInt(limit, 10));
  }
}
