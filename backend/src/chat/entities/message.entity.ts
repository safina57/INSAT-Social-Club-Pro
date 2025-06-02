import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MessageEntity {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  senderId: string;

  @Field()
  conversationId: string;
}
