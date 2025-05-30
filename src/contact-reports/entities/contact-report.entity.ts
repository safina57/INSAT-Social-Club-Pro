import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ContactReport {
  @Field(() => Int)
  id: number;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  message: string;

  @Field()
  createdAt: Date;
}