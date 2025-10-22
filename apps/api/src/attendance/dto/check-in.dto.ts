import {
  IsOptional,
  IsDateString,
  IsBoolean,
  IsString,
  MaxLength,
} from 'class-validator';

export class CheckInDto {
  @IsOptional()
  @IsDateString()
  date?: string; // For manual check-ins by trainers

  @IsOptional()
  @IsBoolean()
  isManual?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes cannot exceed 500 characters' })
  notes?: string;
}
