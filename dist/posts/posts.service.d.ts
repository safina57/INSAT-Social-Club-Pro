import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
export declare class PostsService extends BaseService<Post> {
    constructor(prisma: PrismaService);
    createPost(createPostInput: CreatePostInput, authorId: string): Promise<Post>;
    findAll(): Promise<Post[]>;
    updatePost(id: string, updatePostInput: UpdatePostInput, userId: string): Promise<Post>;
    removePost(id: string, user: User): Promise<Post>;
    likePost(id: string, userId: string): Promise<Post>;
    unlikePost(id: string, userId: string): Promise<Post>;
}
