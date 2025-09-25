import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  gymId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
