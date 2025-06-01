import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eventsPatterns } from 'src/common/events/events.patterns';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    prisma: PrismaService,
    private readonly imageUploadService: ImageUploadService,
    private readonly eventEmitter: EventEmitter2, 
  ) {
    super(prisma, 'user');
  }

  async addFriend(userId: string, friendId: string) {
    const friendRequest = this.prisma.user.update({
      where: { id: userId },
      data: {
        friends: {
          connect: { id: friendId },
        },
      },
      include: {
        friends: true,
      },
    });
    const sender = await this.getCurrentUser(userId);
    this.eventEmitter.emit(eventsPatterns.FRIEND_REQUEST_SENT, {
      type: eventsPatterns.FRIEND_REQUEST_SENT,
      userId: friendId,
      fromUserId: userId,
      senderName: sender?.username,
      senderAvatar: sender?.profilePhoto,
      message:"has sent you a friend request",
    });
    return friendRequest;
  }

  getCurrentUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePhoto: true,
      },
    });
  }
  async updateProfilePhoto(userId: string, file: FileUpload) {
    const url: string = await this.imageUploadService.uploadImage(
      file,
      'avatars',
    );

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        profilePhoto: url,
      },
    });
  }
}
