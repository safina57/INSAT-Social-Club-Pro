import { Author } from 'src/users/entities/author.entity';
export declare class Comment {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: Author;
    authorId: string;
}
