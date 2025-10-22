import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Comment text cannot exceed 500 characters' })
  text: string;
}
