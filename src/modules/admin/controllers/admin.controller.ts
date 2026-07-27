import { Controller, Get, Delete, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats/system')
  async getSystemStats() {
    return this.adminService.getSystemStats();
  }

  @Get('stats/dashboard')
  async getDashboardMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('stats/user/:userId')
  async getUserStats(@Param('userId') userId: string) {
    return this.adminService.getUserStats(userId);
  }

  @Get('users')
  async listAllUsers(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '50',
  ) {
    return this.adminService.listAllUsers(parseInt(skip), parseInt(take));
  }

  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUserAdmin(userId);
  }

  @Post('users/:userId/promote-admin')
  async promoteToAdmin(@Param('userId') userId: string) {
    return this.adminService.promoteTo Admin(userId);
  }
}
