import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Meta {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  lastPage: number;

  @Field(() => Int)
  limit: number;
}