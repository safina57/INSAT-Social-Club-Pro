"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    prisma;
    model;
    constructor(prisma, model) {
        this.prisma = prisma;
        this.model = model;
    }
    create(data) {
        return this.prisma[this.model].create({ data });
    }
    findAll() {
        return this.prisma[this.model].findMany();
    }
    findOne(id) {
        return this.prisma[this.model].findUnique({ where: { id } });
    }
    findByField(field, value) {
        return this.prisma[this.model].findUnique({ where: { [field]: value } });
    }
    update(id, data) {
        return this.prisma[this.model].update({ where: { id }, data });
    }
    remove(id) {
        return this.prisma[this.model].delete({ where: { id } });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map