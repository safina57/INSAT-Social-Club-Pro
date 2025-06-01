import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
export declare class UsersService extends BaseService<User> {
    constructor(prisma: PrismaService);
}
