import {
  LoginDTO,
  LoginResponseDto,
  RegisterDTO,
  RegisterResponseDto,
} from './dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtPayload } from './jwt-payload.interface';
import { HashingService } from './hashing/hashing.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<RegisterResponseDto> {
    const hashedPassword = await this.hashingService.hash(registerDTO.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...registerDTO,
          password: hashedPassword,
        },
      });

      const { password, role, ...rest } = user;
      return {
        message: 'User created successfully',
        data: rest,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'User with this email or username already exists',
        );
      }
      throw error;
    }
  }

  async login(loginDto: LoginDTO): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (
      !user ||
      !(await this.hashingService.compare(password, user.password))
    ) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return {
      access_token: await this.generateAccessToken(user.id, user.role),
    };
  }

  private async generateAccessToken(userId: string, role: Role) {
    const payload: JwtPayload = { id: userId, role: role };
    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }
}
