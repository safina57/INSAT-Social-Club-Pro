import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class TimeFrameData {
  @Field()
  date: string;

  @Field(() => Int)
  count: number;
}