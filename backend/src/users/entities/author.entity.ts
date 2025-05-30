import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';

@ObjectType()
export class Author {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => Role)
  role: Role;
}
