import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CompanyType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
