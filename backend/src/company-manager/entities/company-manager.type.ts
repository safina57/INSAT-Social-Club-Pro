import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ManagerRole } from '../enums/managerRole.enum';

@ObjectType()
export class CompanyManagerType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  companyId: string;

  @Field(() => ManagerRole)
  role: ManagerRole;
}
