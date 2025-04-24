import { PrismaService } from '../../prisma/prisma.service';

export class BaseService<T> {
  constructor(
    protected prisma: PrismaService,
    protected model: keyof PrismaService,
  ) {}

  create(data: any): Promise<T> {
    return (this.prisma[this.model] as any).create({ data });
  }

  findAll(): Promise<T[]> {
    return (this.prisma[this.model] as any).findMany();
  }

  findOne(id: string): Promise<T> {
    return (this.prisma[this.model] as any).findUnique({ where: { id } });
  }

  update(id: string, data: any): Promise<T> {
    return (this.prisma[this.model] as any).update({ where: { id }, data });
  }

  remove(id: string): Promise<T> {
    return (this.prisma[this.model] as any).delete({ where: { id } });
  }
}
