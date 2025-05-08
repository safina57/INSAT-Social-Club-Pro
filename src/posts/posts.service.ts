import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class PostsService extends BaseService<Post> {
  constructor(prisma: PrismaService) {
    super(prisma, 'post');
  }

  async createPost(
    createPostInput: CreatePostInput,
    authorId: string,
  ): Promise<Post> {
    return await this.prisma.post.create({
      data: {
        ...createPostInput,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async updatePost(
    id: string,
    updatePostInput: UpdatePostInput,
    userId: string,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }
    return await this.prisma.post.update({
      where: { id },
      data: updatePostInput,
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async removePost(id: string, user: User): Promise<Post> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }
    return await this.prisma.post.delete({
      where: { id },
    });
  }
}
