import { Controller, Get, Patch, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../common/types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateDto);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteAccount(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.deleteAccount(user.id);
  }

  @Get(':id/public')
  @Public()
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
