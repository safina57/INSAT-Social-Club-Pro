import { IsString } from "class-validator";
import { ManagerRole } from "../enums/managerRole.enum";

export class CreateCompanyManagerDto {
  @IsString()
  userId: string;      

  @IsString()
  companyId: string;   

  @IsEnum(ManagerRole)
  role: ManagerRole = ManagerRole.EDITOR;    
}
