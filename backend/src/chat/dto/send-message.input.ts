import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field()
  @IsNotEmpty()
  recipientId: string;

  @Field()
  @IsNotEmpty()
  content: string;
}
