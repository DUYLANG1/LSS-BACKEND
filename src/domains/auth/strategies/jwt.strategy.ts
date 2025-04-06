import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../config/config.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: any) {
    // For debugging
    console.log('JWT payload:', payload);

    // If we have a sub claim, use it as the user ID
    if (payload.sub) {
      return {
        id: payload.sub,
        sub: payload.sub,
        email: payload.email,
      };
    }

    // If we don't have a sub claim, try to find the user by email
    if (payload.email) {
      try {
        const user = await this.prisma.user.findUnique({
          where: {
            email: payload.email,
            isActive: true,
            deletedAt: null,
          },
          select: {
            id: true,
            email: true,
          },
        });

        if (user) {
          return {
            id: user.id,
            sub: user.id,
            email: user.email,
          };
        }
      } catch (error) {
        console.error('Error finding user by email in JWT strategy:', error);
      }
    }

    // If we can't find a user ID, just return what we have
    return {
      id: undefined,
      sub: undefined,
      email: payload.email,
    };
  }
}
