import { IsString, IsArray, IsOptional, IsIn } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
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
  workoutSplit?:
    | 'Push'
    | 'Pull'
    | 'Legs'
    | 'Full Body'
    | 'Upper'
    | 'Lower'
    | 'Cardio'
    | 'Other';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  musclesWorked?: string[];

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  mediaType?: 'image' | 'video';

  @IsOptional()
  @IsString()
  cloudinaryPublicId?: string;
}
