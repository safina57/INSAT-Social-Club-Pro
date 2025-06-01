import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  getCurrentUser(id: string){
    return this.prisma['user'].findUnique({
      where: { id },
      select: {
      id: true,
      username: true,
      email: true,
      role: true,
      },
    });
  }
}
