import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username?: string;

  @Field(() => String)
  email?: string;

  @Field(() => String)
  password?: string;

  @Field(() => Role)
  role?: Role;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  @Field(() => String)
  accessToken?: string;

  @Field(() => String)
  verificationToken?: string;

  @Field(() => Boolean)
  isVerified?: boolean;

  @Field(() => String)
  resetPasswordToken?: string;


}
