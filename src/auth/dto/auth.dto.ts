import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum GenderDto {
  Male = 'Male',
  Female = 'Female',
}

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(13)
  phone: string;

  @IsEnum(GenderDto, {
    message: 'Gender must be Male or Female',
  })
  @IsNotEmpty()
  gender: GenderDto;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  password: string;
}

export class ProfileDto {
  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  // @IsString()
  // @IsNotEmpty()
  @IsOptional()
  age: string;
}

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  zip: string;
}
