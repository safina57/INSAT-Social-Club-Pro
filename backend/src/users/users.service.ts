import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eventsPatterns } from 'src/common/events/events.patterns';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    prisma: PrismaService,
    private readonly imageUploadService: ImageUploadService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(prisma, 'user');
  }

  async getUserById(id: string) {
    console.log('Finding user with ID:', id);
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }
  async addFriend(userId: string, friendId: string) {
    // Check if users are already friends
    const existingFriendship = await this.prisma.user.findFirst({
      where: {
        id: userId,
        friends: {
          some: { id: friendId },
        },
      },
    });

    if (existingFriendship) {
      throw new Error('Users are already friends');
    }

    // Check if there's already a pending friend request
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    // Create the friend request
    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        senderId: userId,
        receiverId: friendId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
    });

    // Emit friend request sent event
    this.eventEmitter.emit(eventsPatterns.FRIEND_REQUEST_SENT, {
      type: eventsPatterns.FRIEND_REQUEST_SENT,
      userId: friendId,
      fromUserId: userId,
      senderName: friendRequest.sender.username,
      senderAvatar: friendRequest.sender.profilePhoto,
      message: 'has sent you a friend request',
    });

    return friendRequest;
  }
  async acceptFriendRequest(userId: string, friendId: string) {
    // Find the pending friend request
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: friendId,
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
    });

    if (!friendRequest) {
      throw new Error('No pending friend request found');
    }

    // Update the friend request status to ACCEPTED
    await this.prisma.friendRequest.update({
      where: { id: friendRequest.id },
      data: { status: 'ACCEPTED' },
    });

    // Create bidirectional friendship
    const updatedUser = await this.prisma.user.update({
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

    // Also connect the friend back to user for bidirectional relationship
    await this.prisma.user.update({
      where: { id: friendId },
      data: {
        friends: {
          connect: { id: userId },
        },
      },
    });

    const accepter = await this.getCurrentUser(userId);

    // Emit friend request accepted event
    this.eventEmitter.emit(eventsPatterns.FRIEND_REQUEST_ACCEPTED, {
      type: eventsPatterns.FRIEND_REQUEST_ACCEPTED,
      userId: friendId,
      fromUserId: userId,
      senderName: accepter?.username,
      senderAvatar: accepter?.profilePhoto,
      message: 'has accepted your friend request',
    });

    return updatedUser;
  }

  async rejectFriendRequest(userId: string, friendId: string) {
    // Find the pending friend request
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: friendId,
        receiverId: userId,
        status: 'PENDING',
      },
    });

    if (!friendRequest) {
      throw new Error('No pending friend request found');
    }

    // Update the friend request status to REJECTED
    return await this.prisma.friendRequest.update({
      where: { id: friendRequest.id },
      data: { status: 'REJECTED' },
    });
  }

  async getPendingFriendRequests(userId: string) {
    return await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSentFriendRequests(userId: string) {
    return await this.prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'PENDING',
      },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async cancelFriendRequest(userId: string, friendId: string) {
    // Find the pending friend request sent by the user
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: friendId,
        status: 'PENDING',
      },
    });

    if (!friendRequest) {
      throw new Error('No pending friend request found');
    }

    // Delete the friend request
    await this.prisma.friendRequest.delete({
      where: { id: friendRequest.id },
    });

    return { success: true, message: 'Friend request cancelled successfully' };
  }

  async removeFriend(userId: string, friendId: string) {
    // Remove the bidirectional friendship
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        friends: {
          disconnect: { id: friendId },
        },
      },
    });

    await this.prisma.user.update({
      where: { id: friendId },
      data: {
        friends: {
          disconnect: { id: userId },
        },
      },
    });

    return { success: true, message: 'Friend removed successfully' };
  }

  getCurrentUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        friends: true,
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

  async searchUsers(query: string, paginationDto?: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto ?? {};

    return this.prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePhoto: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        username: 'asc',
      },
    });
  }
}
