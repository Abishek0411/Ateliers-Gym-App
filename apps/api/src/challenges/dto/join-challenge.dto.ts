import { IsOptional, IsDateString } from 'class-validator';

export class JoinChallengeDto {
  @IsOptional()
  @IsDateString()
  startAt?: string; // Allow user to start at a specific date
}
