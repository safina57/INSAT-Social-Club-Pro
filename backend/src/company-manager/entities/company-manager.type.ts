import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ManagerRole } from '../enums/managerRole.enum';
import { User } from '../../users/entities/user.entity';

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

  @Field(() => User, { nullable: true })
  user?: User;
}
