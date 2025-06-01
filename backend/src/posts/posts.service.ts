import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException, // Added ConflictException
} from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Role } from 'src/users/enums/role.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eventsPatterns } from 'src/common/events/events.patterns';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { paginate } from 'src/common/utils/paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';

@Injectable()
export class PostsService extends BaseService<Post> {
  constructor(
    prisma: PrismaService,
    private readonly imageUploadService: ImageUploadService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(prisma, 'post');
  }

  async createPost(
    createPostInput: CreatePostInput,
    image: FileUpload | null,
    authorId: string,
  ): Promise<Post> {
    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await this.imageUploadService.uploadImage(image, 'posts');
    }
    return await this.prisma.post.create({
      data: {
        content: createPostInput.content,
        imageUrl,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<Post>> {
    const { page = 1, limit = 10 } = paginationDto ?? {};

    return paginate<Post>(this.prisma.post, {
      page,
      limit,
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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
      data: { ...updatePostInput },
      include: {
        author: true,
        comments: true,
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

  async likePost(id: string, userId: string): Promise<Post> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    await this.prisma.like.create({
      data: {
        userId,
        postId: id,
      },
    });

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        likesCount: {
          increment: 1,
        },
      },
      include: {
        author: true,
        comments: true,
      },
    });
    this.eventEmitter.emit(eventsPatterns.POST_LIKED, {
      type: eventsPatterns.POST_LIKED,
      userId: updatedPost.author.id,
      fromUserId: userId,
      postId: updatedPost.id,
      message: `Your post was liked by user ${userId}`,
    });
    return updatedPost;
  }

  async unlikePost(id: string, userId: string): Promise<Post> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    if (!existingLike) {
      throw new NotFoundException('You have not liked this post');
    }

    await this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    return await this.prisma.post.update({
      where: { id },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
      include: {
        author: true,
        comments: true,
      },
    });
  }
}
