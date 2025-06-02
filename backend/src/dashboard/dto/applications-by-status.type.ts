import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ApplicationsByStatus {
  @Field(() => Int)
  PENDING: number;

  @Field(() => Int)
  ACCEPTED: number;

  @Field(() => Int)
  REJECTED: number;
}
