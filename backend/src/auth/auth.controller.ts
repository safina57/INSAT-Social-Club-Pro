import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  LoginResponseDto,
  RegisterDTO,
  RegisterResponseDto,
  VerifyResponseDto,
  ForgotPasswordResponseDto,
} from './dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDTO: LoginDTO): Promise<LoginResponseDto> {
    return this.authService.login(loginDTO);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDTO: RegisterDTO): Promise<RegisterResponseDto> {
    return this.authService.register(registerDTO);
  }

  @Public()
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  verify(@Query('token') token: string): Promise<VerifyResponseDto> {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body('email') email: string,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.resetPassword(token, newPassword);
  }
}
