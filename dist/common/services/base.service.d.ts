import { PrismaService } from '../../prisma/prisma.service';
export declare class BaseService<T> {
    protected prisma: PrismaService;
    protected model: keyof PrismaService;
    constructor(prisma: PrismaService, model: keyof PrismaService);
    create(data: any): Promise<T>;
    findAll(): Promise<T[]>;
    findOne(id: string): Promise<T>;
    findByField(field: string, value: any): Promise<T>;
    update(id: string, data: any): Promise<T>;
    remove(id: string): Promise<T>;
}
