import { InputType, Field } from '@nestjs/graphql';
import { ManagerRole } from '../enums/managerRole.enum';
import { IsEnum, IsString } from 'class-validator';

@InputType()
export class UpdateCompanyManagerInput {
  @IsString()
  @Field()
  managerId: string;

  @IsString()
  @Field()
  companyId: string;

  @IsEnum(ManagerRole)
  @Field(() => ManagerRole)
  role: ManagerRole;
}
