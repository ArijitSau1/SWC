import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';

const cookieExtractor = (request: Request): string | null => {
  return request?.cookies?.access_token || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
  cookieExtractor,
]),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload) {
    const user = await this.authService.validate(payload.id);

    if (!user) {
      throw new UnauthorizedException('Authentication failed.');
    }
    return user;
  }
}