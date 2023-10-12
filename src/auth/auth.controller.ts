import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AddressDto, AuthDto, LoginDto, ProfileDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(
    @Body() authDto: AuthDto,
    @Body() profileDto: ProfileDto,
    @Body() addressDto: AddressDto,
    @Res() res: Response,
  ) {
    return this.authService.register(
      authDto,
      profileDto,
      addressDto,
      res,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
