import { IsString } from "class-validator";
import { ManagerRole } from "../enums/managerRole.enum";

export class CreateCompanyManagerDto {
  @IsString()
  userId: string;      

  @IsString()
  companyId: string;   

  role: ManagerRole = ManagerRole.EDITOR;    
}
