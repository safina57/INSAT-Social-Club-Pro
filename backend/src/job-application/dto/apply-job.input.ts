import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ApplyJobInput {
  @IsString()
  @Field()
  jobId: string;
}
