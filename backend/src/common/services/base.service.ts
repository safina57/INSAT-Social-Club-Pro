import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResult } from '../types/paginated-result.type';
import { paginate } from '../utils/paginate';

export class BaseService<T> {
  constructor(
    protected prisma: PrismaService,
    protected model: keyof PrismaService,
  ) {}

  create(data: any): Promise<T> {
    return (this.prisma[this.model] as any).create({ data });
  }

  findAll(paginationDto: PaginationDto): Promise<PaginatedResult<T>> {
    return paginate<T>(this.prisma[this.model], {
      page: paginationDto.page ?? 1,
      limit: paginationDto.limit ?? 10,
    });
  }

  findOne(id: string): Promise<T> {
    return (this.prisma[this.model] as any).findUnique({ where: { id } });
  }

  findByField(field: string, value: any): Promise<T> {
    return (this.prisma[this.model] as any).findUnique({
      where: { [field]: value },
    });
  }

  update(id: string, data: any): Promise<T> {
    return (this.prisma[this.model] as any).update({ where: { id }, data });
  }

  remove(id: string): Promise<T> {
    return (this.prisma[this.model] as any).delete({ where: { id } });
  }
}
