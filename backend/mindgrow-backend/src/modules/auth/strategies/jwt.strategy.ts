import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ttsbdnhrucfzzceqcesc.supabase.co';
    // Remove trailing slash
    const baseUrl = supabaseUrl.replace(/\/$/, '');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Use JWKS endpoint for ES256 token validation
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${baseUrl}/auth/v1/.well-known/jwks.json`,
      }),
      algorithms: ['ES256'],
    });
  }

  /**
   * Supabase JWT payload contains:
   * - sub: user UUID
   * - email: user email
   * - user_metadata: { username, name, etc. }
   */
  async validate(payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Find or create user in our DB based on Supabase UUID
    const user = await this.usersService.findOrCreate({
      id: payload.sub,
      email: payload.email,
      name: payload.user_metadata?.name || payload.user_metadata?.username || null,
    });

    return user;
  }
}
