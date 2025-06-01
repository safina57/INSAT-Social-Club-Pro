import { ObjectType, Field } from '@nestjs/graphql';
import { MessageEntity } from './message.entity';
import { User } from '../../users/entities/user.entity';


@ObjectType()
export class ConversationEntity {
  @Field()
  id: string;

  @Field(() => [User])
  participants: User[];

  @Field(() => [MessageEntity], { nullable: true })
  messages?: MessageEntity[];
}
