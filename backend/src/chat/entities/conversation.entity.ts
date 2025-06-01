import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from './message.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => [User])
  participants: User[];

  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
