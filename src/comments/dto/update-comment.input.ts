import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateCommentInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  content: string;
}
