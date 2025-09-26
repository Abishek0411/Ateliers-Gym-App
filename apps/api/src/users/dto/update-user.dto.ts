import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEnum(['Basic', 'Premium', 'VIP'])
  membershipType?: 'Basic' | 'Premium' | 'VIP';

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteWorkouts?: string[];
}
