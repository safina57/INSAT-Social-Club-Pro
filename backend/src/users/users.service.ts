import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { ImageUploadService } from '../image-upload/image-upload.service';
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    prisma: PrismaService,
    private readonly imageUploadService: ImageUploadService,
  ) {
    super(prisma, 'user');
  }

  async addFriend(userId: string, friendId: string): Promise<User> {
    return this.prisma.user.update({
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

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        profilePhoto: url,
      },
    });
  }
}
