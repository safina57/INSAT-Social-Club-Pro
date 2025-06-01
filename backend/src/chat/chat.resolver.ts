import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { SendMessageInput } from './dto/send-message.input';
import { MessageEntity } from './entities/message.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { ConversationEntity } from './entities/conversation.entity';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JWTAuthGuard)
@Resolver(() => MessageEntity)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => MessageEntity)
  async sendMessage(
    @GetUser() user: User,
    @Args('input') input: SendMessageInput,
  ) {
    return this.chatService.sendMessage(user.id, input.recipientId, input.content);
  }

  @Query(() => [MessageEntity])
  async getMessages(
    @GetUser() user: User,
    @Args('withUserId') withUserId: string,
  ) {
    return this.chatService.getMessagesBetweenUsers(user.id, withUserId);
  }
  
  @Query(() => [ConversationEntity])
  async getMyConversations(@GetUser() user: User) {
    return this.chatService.getConversationsForUser(user.id);
  }
}
