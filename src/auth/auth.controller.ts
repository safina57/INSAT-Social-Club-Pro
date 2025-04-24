import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  LoginResponseDto,
  RegisterDTO,
  RegisterResponseDto,
} from './dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDTO: LoginDTO): Promise<LoginResponseDto> {
    return this.authService.login(loginDTO);
  }

  @Public()
  @Post('register')
  register(@Body() registerDTO: RegisterDTO): Promise<RegisterResponseDto> {
    return this.authService.register(registerDTO);
  }
}
