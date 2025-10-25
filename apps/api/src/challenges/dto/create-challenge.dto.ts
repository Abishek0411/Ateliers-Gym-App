import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TaskDto {
  @IsNumber()
  day: number;

  @IsString()
  task: string;
}

export class HeroImageDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  publicId?: string;
}

export class CreateChallengeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HeroImageDto)
  heroImage?: HeroImageDto;

  @IsEnum(['streak', 'daily', 'task'])
  type: 'streak' | 'daily' | 'task';

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks?: TaskDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
