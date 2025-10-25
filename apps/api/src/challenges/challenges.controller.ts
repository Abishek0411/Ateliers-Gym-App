import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { MarkProgressDto } from './dto/mark-progress.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('challenges')
@UseGuards(JwtAuthGuard)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // Admin/Manager endpoints
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'trainer')
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(@Query() query: PaginationQueryDto) {
    return this.challengesService.getChallenges(query);
  }

  @Get(':id')
  async getChallengeById(@Param('id') id: string) {
    return this.challengesService.getChallengeById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'trainer')
  async updateChallenge(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto
  ) {
    return this.challengesService.updateChallenge(id, updateChallengeDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'trainer')
  async deleteChallenge(@Param('id') id: string) {
    await this.challengesService.deleteChallenge(id);
    return { message: 'Challenge deleted successfully' };
  }

  // Member/Trainer/Admin endpoints
  @Post(':id/join')
  async joinChallenge(
    @Param('id') id: string,
    @Body() joinDto: JoinChallengeDto,
    @Request() req: { user: any }
  ) {
    const user = req.user;
    return this.challengesService.joinChallenge(
      id,
      user.gymId,
      user.name,
      joinDto
    );
  }

  @Get(':id/participation')
  async getParticipation(
    @Param('id') id: string,
    @Request() req: { user: any }
  ) {
    const user = req.user;
    return this.challengesService.getParticipation(id, user.gymId);
  }

  @Post(':id/progress')
  async markProgress(
    @Param('id') id: string,
    @Body() markProgressDto: MarkProgressDto,
    @Request() req: { user: any }
  ) {
    const user = req.user;
    return this.challengesService.markProgress(id, user.gymId, markProgressDto);
  }

  @Get(':id/leaderboard')
  async getLeaderboard(
    @Param('id') id: string,
    @Query('limit') limit?: number
  ) {
    return this.challengesService.getLeaderboard(id, limit);
  }

  @Get('user/:gymId')
  async getUserChallenges(@Param('gymId') gymId: string) {
    return this.challengesService.getUserChallenges(gymId);
  }

  @Post(':id/leave')
  async leaveChallenge(@Param('id') id: string, @Request() req: { user: any }) {
    const user = req.user;
    await this.challengesService.leaveChallenge(id, user.gymId);
    return { message: 'Successfully left the challenge' };
  }
}
