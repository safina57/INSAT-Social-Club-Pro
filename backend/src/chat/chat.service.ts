import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eventsPatterns } from 'src/common/events/events.patterns';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async findConversationBetween(user1Id: string, user2Id: string) {
    return this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: user1Id } } },
          { participants: { some: { id: user2Id } } },
        ],
      },
    });
  }

  async getOrCreateConversation(user1Id: string, user2Id: string) {
    const existingConversation = await this.findConversationBetween(
      user1Id,
      user2Id,
    );
    if (existingConversation) return existingConversation;

    return this.prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: user1Id }, { id: user2Id }],
        },
      },
      include: { participants: true },
    });
  }

  async sendMessage(senderId: string, recipientId: string, content: string) {
    const conversation = await this.getOrCreateConversation(
      senderId,
      recipientId,
    );

    const message = this.prisma.message.create({
      data: {
        senderId,
        conversationId: conversation.id,
        content,
      },
      include: {
        sender: true,
        conversation: { include: { participants: true } },
      },
    });
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { username: true, profilePhoto: true },
    });
    this.eventEmitter.emit(eventsPatterns.MESSAGE_RECIEVED, {
      type: eventsPatterns.MESSAGE_RECIEVED,
      userId: recipientId,
      fromUserId: senderId,
      senderName: sender?.username,
      senderAvatar: sender?.profilePhoto,
      message: 'sent you a message',
    });
    return message;
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string) {
    const conversation = await this.findConversationBetween(user1Id, user2Id);
    if (!conversation) return [];

    return this.prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      include: { sender: true },
    });
  }

  async getConversationsForUser(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}
