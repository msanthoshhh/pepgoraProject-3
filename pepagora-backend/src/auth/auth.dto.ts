import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'category_manager', 'pepagora_manager'])
  role: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
