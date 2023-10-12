import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as argon from 'argon2';
import { validateOrReject } from 'class-validator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { AddressDto, AuthDto, LoginDto, ProfileDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(
    authDto: AuthDto,
    profileDto: ProfileDto,
    addressDto: AddressDto,
    @Res() res: Response,
  ) {
    try {
      const dob = new Date(profileDto.dob);
      const currentDate = new Date();

      // count different year, month, day between birth date and current date
      const diffTime = Math.abs(
        currentDate.getTime() - dob.getTime(),
      );
      const diffYears = Math.floor(
        diffTime / (1000 * 60 * 60 * 24 * 365),
      );
      const diffMonths = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24 * 365)) /
          (1000 * 60 * 60 * 24 * 30),
      );
      const diffDays = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24 * 30)) /
          (1000 * 60 * 60 * 24),
      );

      // change format birth_date become "YYYY-MM-DD"
      const formattedBirthDate = dob.toISOString().split('T')[0];

      // create instance profile for data input validation
      const profile = {
        dob: formattedBirthDate,
        age: `${diffYears} tahun, ${diffMonths} bulan, ${diffDays} hari`,
        address: {
          street: addressDto.street,
          city: addressDto.city,
          state: addressDto.state,
          zip: addressDto.zip,
        },
      };

      // validated variable profile
      await validateOrReject(profile);

      // generate password
      const hash = await argon.hash(authDto.password);

      // save the new user in the db
      const newUser = await this.prisma.user.create({
        data: {
          name: authDto.name,
          email: authDto.email,
          password: hash,
          phone: authDto.phone,
          profile: {
            dob: dob, // using variable dob that is already formatted Date
            age: `${diffYears} tahun, ${diffMonths} bulan, ${diffDays} hari`,
            address: {
              street: addressDto.street,
              city: addressDto.city,
              state: addressDto.state,
              zip: addressDto.zip,
            },
          },
          gender: authDto.gender,
        },
      });

      delete newUser.password;
      delete newUser.profile;
      // delete profile;

      // return the saved user
      res.status(201).send({
        status: 'Success',
        message: 'User created',
        data: {
          newUser,
          profile,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // P2002 for duplicated data
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials Incorrect');

    // compare password
    const pwMatches = await argon.verify(
      user.password,
      loginDto.password,
    );

    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException('Credentials Incorrect');

    const tokenUser = await this.signToken(user.id, user.email);
    return {
      status: 'Logged in',
      message: 'You are authenticated',
      name: user.name,
      email: user.email,
      tokenUser,
    };
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secretKey = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secretKey,
    });

    return {
      access_token: token,
    };
  }
}
