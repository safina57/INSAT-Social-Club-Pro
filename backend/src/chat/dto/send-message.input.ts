import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  conversationId: string;

  @Field()
  content: string;
}
