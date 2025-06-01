import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { Role } from 'src/users/enums/role.enum';
import { Comment, User } from '@prisma/client';
import { UpdateCommentInput } from './dto/update-comment.input';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eventsPatterns } from 'src/common/events/events.patterns';

@Injectable()
export class CommentsService extends BaseService<Comment> {
  constructor(prisma: PrismaService, private readonly eventEmitter: EventEmitter2) {
    super(prisma, 'comment');
  }

  async createComment(
    createCommentInput: CreateCommentInput,
    authorId: string,
  ): Promise<Comment> {
    const { content, postId } = createCommentInput;
    const post = await this.prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true }, 
  });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const comment =  await this.prisma.comment.create({
      data: {
        content,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });
    
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: { username: true },
    });

    this.eventEmitter.emit(eventsPatterns.POST_COMMENTED, {
      type: eventsPatterns.POST_COMMENTED,
      userId: post.authorId,
      authorId,
      authorUsername: author?.username,
      postId,
      commentId: comment.id,
      message: `commented on your post`,
      commentContent: comment.content,
    });

    return comment;
  }

  async updateComment(
    id: string,
    updateCommentInput: UpdateCommentInput,
    authorId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.authorId !== authorId) {
      throw new ForbiddenException(
        'You are not authorized to update this comment',
      );
    }

    const { content } = updateCommentInput;

    return await this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  async removeComment(id: string, user: User): Promise<Comment> {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to delete this comment',
      );
    }
    return await this.prisma.comment.delete({
      where: { id },
    });
  }
}
