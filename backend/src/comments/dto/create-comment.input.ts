import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  content: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  postId: string;
}
