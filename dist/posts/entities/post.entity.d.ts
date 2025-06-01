import { Comment } from '../../comments/entities/comment.entity';
import { Author } from 'src/users/entities/author.entity';
export declare class Post {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    author: Author;
    authorId: string;
    comments?: Comment[] | null;
}
