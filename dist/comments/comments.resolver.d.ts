import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { User } from '@prisma/client';
export declare class CommentsResolver {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    createComment(createCommentInput: CreateCommentInput, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    updateComment(id: string, updateCommentInput: UpdateCommentInput, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    removeComment(id: string, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
}
