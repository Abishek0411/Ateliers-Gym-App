import { IsString, IsArray, IsOptional, IsIn } from 'class-validator';

export class CreatePostDto {
  @IsString()
  text: string;

  @IsString()
  @IsIn([
    'Push',
    'Pull',
    'Legs',
    'Full Body',
    'Upper',
    'Lower',
    'Cardio',
    'Other',
  ])
  workoutSplit:
    | 'Push'
    | 'Pull'
    | 'Legs'
    | 'Full Body'
    | 'Upper'
    | 'Lower'
    | 'Cardio'
    | 'Other';

  @IsArray()
  @IsString({ each: true })
  musclesWorked: string[];

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
