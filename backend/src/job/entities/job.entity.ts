import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Job {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  salary?: number;

  @Field()
  companyId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
