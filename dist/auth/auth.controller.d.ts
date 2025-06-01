import { AuthService } from './auth.service';
import { LoginDTO, LoginResponseDto, RegisterDTO, RegisterResponseDto, VerifyResponseDto, ForgotPasswordResponseDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDTO: LoginDTO): Promise<LoginResponseDto>;
    register(registerDTO: RegisterDTO): Promise<RegisterResponseDto>;
    verify(token: string): Promise<VerifyResponseDto>;
    forgotPassword(email: string): Promise<ForgotPasswordResponseDto>;
    resetPassword(token: string, newPassword: string): Promise<ForgotPasswordResponseDto>;
}
