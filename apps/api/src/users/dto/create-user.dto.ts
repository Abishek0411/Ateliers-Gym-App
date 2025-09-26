import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  gymId: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'trainer', 'member'])
  role: 'admin' | 'trainer' | 'member';

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
