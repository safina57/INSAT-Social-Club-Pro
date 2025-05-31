import { InputType, Field } from '@nestjs/graphql';
import { ManagerRole } from '../enums/managerRole.enum';

@InputType()
export class CreateCompanyManagerInput {
  @Field()
  userId: string;

  @Field()
  companyId: string;

  @Field(() => ManagerRole)
  role: ManagerRole;
}
