import {
  IsOptional,
  IsDateString,
  IsNumber,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CreateMeasurementDto {
  @IsOptional()
  @IsDateString()
  date?: string; // ISO date string, defaults to now

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(200)
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(200)
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(200)
  hipsCm?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
