import { ManagerRole } from "../enums/managerRole.enum";

export class CreateCompanyManagerDto {
  userId: string;      
  companyId: string;   
  role: ManagerRole;       
}
