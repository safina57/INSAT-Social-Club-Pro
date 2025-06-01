import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { Comment, User } from '@prisma/client';
import { UpdateCommentInput } from './dto/update-comment.input';
export declare class CommentsService extends BaseService<Comment> {
    constructor(prisma: PrismaService);
    createComment(createCommentInput: CreateCommentInput, authorId: string): Promise<Comment>;
    updateComment(id: string, updateCommentInput: UpdateCommentInput, authorId: string): Promise<Comment>;
    removeComment(id: string, user: User): Promise<Comment>;
}
