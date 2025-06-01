import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ManagerRole } from '@prisma/client';

@Injectable()
export class CompanyManagerService {
  constructor(private readonly prisma: PrismaService) {}

  async addManager(userIdToAssign: string, companyId: string, role: ManagerRole, currentUserId: string) {
    // Check if currentUserId is ADMIN of company
    const currentManager = await this.prisma.companyManager.findUnique({
      where: {
        userId_companyId: {
          userId: currentUserId,
          companyId,
        },
      },
    });
    if (!currentManager || currentManager.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to assign managers to this company');
    }

    // Check if user to assign exists
    const userToAssign = await this.prisma.user.findUnique({ where: { id: userIdToAssign } });
    if (!userToAssign) throw new NotFoundException('User to assign as manager not found');

    // Check if already assigned
    const existing = await this.prisma.companyManager.findUnique({
      where: {
        userId_companyId: {
          userId: userIdToAssign,
          companyId,
        },
      },
    });
    if (existing) throw new ConflictException('User is already a manager of this company');

    // Assign user as manager
    return this.prisma.companyManager.create({
      data: {
        userId: userIdToAssign,
        companyId,
        role,
      },
    });
  }

  async removeManager(userIdToRemove: string, companyId: string, currentUserId: string) {
    // Only ADMIN can remove managers
    const currentManager = await this.prisma.companyManager.findUnique({
      where: {
        userId_companyId: {
          userId: currentUserId,
          companyId,
        },
      },
    });
    if (!currentManager || currentManager.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to remove managers from this company');
    }

    // Check if manager to remove exists
    const toRemove = await this.prisma.companyManager.findUnique({
      where: {
        userId_companyId: {
          userId: userIdToRemove,
          companyId,
        },
      },
    });
    if (!toRemove) throw new NotFoundException('Manager to remove not found');

    // Optionally, prevent removing yourself (ADMIN)
    if (userIdToRemove === currentUserId) {
      throw new ForbiddenException('You cannot remove yourself as a manager');
    }

    return this.prisma.companyManager.delete({
      where: {
        userId_companyId: {
          userId: userIdToRemove,
          companyId,
        },
      },
    });
  }

  async listManagers(companyId: string) {
    return this.prisma.companyManager.findMany({
      where: { companyId },
      include: { user: true },
    });
  }
}
