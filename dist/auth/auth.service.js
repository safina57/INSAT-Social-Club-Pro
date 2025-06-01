"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
const hashing_service_1 = require("./hashing/hashing.service");
const client_1 = require("@prisma/client");
const users_service_1 = require("../users/users.service");
const mailer_service_1 = require("../mailer/mailer.service");
let AuthService = class AuthService {
    prisma;
    hashingService;
    jwtService;
    config;
    usersService;
    mailerService;
    constructor(prisma, hashingService, jwtService, config, usersService, mailerService) {
        this.prisma = prisma;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
        this.config = config;
        this.usersService = usersService;
        this.mailerService = mailerService;
    }
    async register(registerDTO) {
        if (!this.isPasswordStrong(registerDTO.password)) {
            throw new common_1.BadRequestException('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
        }
        const hashedPassword = await this.hashingService.hash(registerDTO.password);
        try {
            const user = await this.usersService.create({
                ...registerDTO,
                password: hashedPassword,
                role: client_1.Role.USER,
            });
            const verifyToken = this.generateVerificationToken(user);
            await this.usersService.update(user.id, {
                ...user,
                verificationToken: verifyToken,
            });
            const verificationUrl = `${this.config.get('FRONTEND_URL')}/verify-email?token=${verifyToken}`;
            const emailHtml = `<p>Please click the following link to verify your email:</p>
                         <p><a href="${verificationUrl}">${verificationUrl}</a></p>`;
            await this.mailerService.sendMail(user.email, 'Verify Your Email', emailHtml);
            return {
                message: 'User created successfully',
                data: user,
            };
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException('User with this email or username already exists');
            }
            throw error;
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user ||
            !(await this.hashingService.compare(password, user.password))) {
            throw new common_1.ForbiddenException('Credentials incorrect');
        }
        if (!user.isVerified) {
            throw new common_1.ForbiddenException('Email not verified');
        }
        const access_token = await this.generateAccessToken(user.id, user.role);
        await this.usersService.update(user.id, {
            ...user,
            accessToken: access_token,
        });
        return {
            access_token: access_token,
        };
    }
    async generateAccessToken(userId, role) {
        const payload = { id: userId, role: role };
        const access_token = await this.jwtService.signAsync(payload);
        return access_token;
    }
    async verifyEmail(token) {
        const payload = this.jwtService.verify(token, {
            secret: this.config.get('JWT_EMAIL_VERIFICATION_SECRET'),
        });
        if (payload.type !== 'email-verification') {
            throw new common_1.BadRequestException('Invalid verification token');
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTimestamp) {
            throw new common_1.BadRequestException('Verification link expired.');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                id: payload.sub,
                verificationToken: token,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
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
    async logout(userId) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        await this.usersService.update(userId, {
            ...user,
            accessToken: null,
        });
        return { message: 'Logged out successfully' };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByField('email', email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const resetPassToken = this.generateResetPassToken(user);
        await this.usersService.update(user.id, {
            ...user,
            resetPasswordToken: resetPassToken,
        });
        const resetUrl = `${this.config.get('FRONTEND_URL')}/reset-password?token=${resetPassToken}`;
        const emailHtml = `<p>Please click the following link to reset your password:</p>
                       <p><a href="${resetUrl}">${resetUrl}</a></p>`;
        await this.mailerService.sendMail(email, 'Reset Your Password', emailHtml);
        return {
            message: 'Reset password email sent successfully',
        };
    }
    async resetPassword(token, newPassword) {
        const payload = this.jwtService.verify(token, {
            secret: this.config.get('JWT_RESET_PASS_SECRET'),
        });
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTimestamp) {
            throw new common_1.BadRequestException('Verification link expired.');
        }
        const user = await this.prisma.user.findFirst({
            where: { resetPasswordToken: token },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        if (!this.isPasswordStrong(newPassword)) {
            throw new common_1.BadRequestException('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
        }
        const hashedPassword = await this.hashingService.hash(newPassword);
        await this.usersService.update(user.id, {
            ...user,
            password: hashedPassword,
            resetPasswordToken: null,
        });
        return {
            message: 'Password reset successfully',
        };
    }
    async sendVerificationEmail(email) {
        const user = await this.usersService.findByField('email', email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const verifyToken = this.generateVerificationToken(user);
        await this.usersService.update(user.id, {
            ...user,
            verificationToken: verifyToken,
        });
        const verificationUrl = `${this.config.get('FRONTEND_URL')}/verify-email?token=${verifyToken}`;
        const emailHtml = `<p>Please click the following link to verify your email:</p>
                       <p><a href="${verificationUrl}">${verificationUrl}</a></p>`;
        await this.mailerService.sendMail(user.email, 'Verify Your Email', emailHtml);
    }
    generateResetPassToken(user) {
        const payload = {
            sub: user.id,
            type: 'reset',
        };
        return this.jwtService.sign(payload, {
            expiresIn: this.config.get('JWT_RESET_PASS_SECRET_EXPIRES_IN'),
            secret: this.config.get('JWT_RESET_PASS_SECRET'),
        });
    }
    generateVerificationToken(user) {
        const payload = {
            sub: user.id,
            type: 'email-verification',
        };
        return this.jwtService.sign(payload, {
            expiresIn: this.config.get('JWT_EMAIL_VERIFICATION_EXPIRES_IN'),
            secret: this.config.get('JWT_EMAIL_VERIFICATION_SECRET'),
        });
    }
    isPasswordStrong(password) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        hashing_service_1.HashingService,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService,
        mailer_service_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map