import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/enum/user-role.enum';

export default class APIFeatures {
  static async assignJwtToken(
    userId: string,
    role: UserRole,
    jwtService: JwtService,
  ): Promise<string> {
    return jwtService.sign({
      sub: userId,
      roles: [role],
    });
  }
}