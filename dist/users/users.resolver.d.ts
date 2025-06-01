import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserInput: CreateUserInput): Promise<{
        email: string;
        password: string;
        username: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        accessToken: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
    }>;
    findAll(): Promise<{
        email: string;
        password: string;
        username: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        accessToken: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        password: string;
        username: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        accessToken: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
    }>;
    updateUser(updateUserInput: UpdateUserInput): Promise<{
        email: string;
        password: string;
        username: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        accessToken: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
    }>;
    removeUser(id: string): Promise<{
        email: string;
        password: string;
        username: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        accessToken: string | null;
        isVerified: boolean;
        verificationToken: string | null;
        resetPasswordToken: string | null;
    }>;
}
