import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SimpleResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}
