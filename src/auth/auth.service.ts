import {
  LoginDTO,
  LoginResponseDto,
  RegisterDTO,
  RegisterResponseDto,
} from './dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtPayload } from './jwt-payload.interface';
import { HashingService } from './hashing/hashing.service';
import { Role, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<RegisterResponseDto> {
    if(!this.isPasswordStrong(registerDTO.password)) {
      throw new BadRequestException('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
    }

    const hashedPassword = await this.hashingService.hash(registerDTO.password);

    try {
      const user = await this.usersService.create({
        ...registerDTO,
        password: hashedPassword,
        role: Role.USER,
      });
      
      const verifyToken = this.generateVerificationToken(user);
      await this.usersService.update(user.id, {
        ...user,
        verificationToken: verifyToken,
      });
      await this.mailerService.sendVerificationEmail(user.email, verifyToken);

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

    if (!user.isVerified) {
      throw new ForbiddenException('Email not verified');
    }
    const access_token = await this.generateAccessToken(user.id, user.role);
    this.usersService.update(user.id, {
      ...user,
      accessToken: access_token,
    });

    return {
      access_token: access_token,
    };
  }

  private async generateAccessToken(userId: string, role: Role) {
    const payload: JwtPayload = { id: userId, role: role };
    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }

  async verifyEmail(token: string) {
    const payload = this.jwtService.verify<{
      sub: string;
      type: string;
      exp: number;
    }>(token, {
      secret: this.config.get('JWT_EMAIL_VERIFICATION_SECRET'),
    });

    if (payload.type !== 'email-verification') {
      throw new BadRequestException('Invalid verification token');
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimestamp) {
      throw new BadRequestException('Verification link expired.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
        verificationToken: token,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (user.isVerified) {
      return {
        message: 'Email is already verified.',
      };
    }

    await this.usersService.update(user.id, {
      ...user,
      isVerified: true,
      verificationToken: null,
    });

    return {
      message: 'Email verified successfully',
    };
  }

  async logout(userId: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersService.update(userId, {
      ...user,
      accessToken: null,
    });

    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByField('email', email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetPassToken = this.generateResetPassToken(user);

    await this.usersService.update(user.id, {
      ...user,
      resetPasswordToken: resetPassToken,
    });

    await this.mailerService.sendResetPasswordEmail(email, resetPassToken);

    return {
      message: 'Reset password email sent successfully',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ) {
    const payload = this.jwtService.verify<{
      sub: number;
      type: string;
      exp: number;
    }>(token, {
      secret: this.config.get('JWT_RESET_PASS_SECRET'),
    });

    // Check if token is expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimestamp) {
      throw new BadRequestException('Verification link expired.');
    }

    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Validate password strength
    if (!this.isPasswordStrong(newPassword)) {
      throw new BadRequestException(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    // Hash the new password
    const hashedPassword = await this.hashingService.hash(newPassword);

    // Update the user's password and clear the reset token
    await this.usersService.update(user.id, {
      ...user,
      password: hashedPassword,
      resetPasswordToken: null,
    });

    return {
      message: 'Password reset successfully',
    };
  }

  async sendVerificationEmail(email: string) {
    const user = await this.usersService.findByField('email', email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verifyToken = this.generateVerificationToken(user);

    await this.usersService.update(user.id, {
      ...user,
      verificationToken: verifyToken,
    });

    await this.mailerService.sendVerificationEmail(user.email, verifyToken);
  }

  private generateResetPassToken(user: User) {
    const payload = {
      sub: user.id,
      type: 'reset',
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_RESET_PASS_SECRET_EXPIRES_IN'),
      secret: this.config.get('JWT_RESET_PASS_SECRET'),
    });
  }

  private generateVerificationToken(user: User): string {
    const payload = {
      sub: user.id,
      type: 'email-verification',
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_EMAIL_VERIFICATION_EXPIRES_IN'),
      secret: this.config.get('JWT_EMAIL_VERIFICATION_SECRET'),
    });
  }

  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }
}
