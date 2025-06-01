import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

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
    const existingConversation = await this.findConversationBetween(user1Id, user2Id);
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
    const conversation = await this.getOrCreateConversation(senderId, recipientId);

    return this.prisma.message.create({
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
}
