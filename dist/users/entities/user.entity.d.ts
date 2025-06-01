import { Role } from '../enums/role.enum';
import { Comment } from '../../comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    accessToken?: string | null;
    verificationToken?: string | null;
    isVerified: boolean;
    resetPasswordToken?: string | null;
    posts?: Post[] | null;
    comments?: Comment[] | null;
}
