import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepository.findByEmailWithPassword(
      dto.email,
    );
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.authRepository.createUser(
      dto.name,
      dto.email,
      hashedPassword,
    );

    return this.signToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findByEmailWithPassword(
      dto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.signToken(user.id, user.email, user.role);
  }

  private async signToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, user: { id: userId, email, role } };
  }
}
