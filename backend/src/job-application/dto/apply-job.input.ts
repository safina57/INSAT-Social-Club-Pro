import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ApplyJobInput {
  @Field()
  jobId: string;
}
