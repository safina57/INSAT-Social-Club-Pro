import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateJobInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  companyId: string;
}
