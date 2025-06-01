import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { User } from '@prisma/client';
import { PostsService } from './posts.service';
export declare class PostsResolver {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(createPostInput: CreatePostInput, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        likesCount: number;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        likesCount: number;
    }[]>;
    updatePost(id: string, updatePostInput: UpdatePostInput, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        likesCount: number;
    }>;
    removePost(id: string, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        likesCount: number;
    }>;
    likePost(id: string, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        likesCount: number;
    }>;
    unlikePost(id: string, user: User): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        likesCount: number;
    }>;
}
