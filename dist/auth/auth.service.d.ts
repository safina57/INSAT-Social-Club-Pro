import { LoginDTO, LoginResponseDto, RegisterDTO, RegisterResponseDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from './hashing/hashing.service';
import { UsersService } from 'src/users/users.service';
import { MailerService } from 'src/mailer/mailer.service';
export declare class AuthService {
    private readonly prisma;
    private readonly hashingService;
    private readonly jwtService;
    private readonly config;
    private readonly usersService;
    private readonly mailerService;
    constructor(prisma: PrismaService, hashingService: HashingService, jwtService: JwtService, config: ConfigService, usersService: UsersService, mailerService: MailerService);
    register(registerDTO: RegisterDTO): Promise<RegisterResponseDto>;
    login(loginDto: LoginDTO): Promise<LoginResponseDto>;
    private generateAccessToken;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    sendVerificationEmail(email: string): Promise<void>;
    private generateResetPassToken;
    private generateVerificationToken;
    private isPasswordStrong;
}
