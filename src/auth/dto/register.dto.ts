import { IsNotEmpty } from 'class-validator';
import { LoginDTO } from './login.dto';

export class RegisterDTO extends LoginDTO {
  @IsNotEmpty()
  username: string;
}
