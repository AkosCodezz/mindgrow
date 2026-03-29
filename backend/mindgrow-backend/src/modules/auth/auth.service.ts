import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

/**
 * Auth service - simplified since Supabase handles authentication.
 * This service only handles user lookup for protected routes.
 */
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }
}
