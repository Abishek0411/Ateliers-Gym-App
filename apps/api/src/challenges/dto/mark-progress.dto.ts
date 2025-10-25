import { IsNumber, IsBoolean } from 'class-validator';

export class MarkProgressDto {
  @IsNumber()
  day: number;

  @IsBoolean()
  completed: boolean;
}
