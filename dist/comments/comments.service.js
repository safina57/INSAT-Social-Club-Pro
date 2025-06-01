"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../common/services/base.service");
const role_enum_1 = require("../users/enums/role.enum");
let CommentsService = class CommentsService extends base_service_1.BaseService {
    constructor(prisma) {
        super(prisma, 'comment');
    }
    async createComment(createCommentInput, authorId) {
        const { content, postId } = createCommentInput;
        return await this.prisma.comment.create({
            data: {
                content,
                post: {
                    connect: {
                        id: postId,
                    },
                },
                author: {
                    connect: {
                        id: authorId,
                    },
                },
            },
        });
    }
    async updateComment(id, updateCommentInput, authorId) {
        const comment = await this.findOne(id);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.authorId !== authorId) {
            throw new common_1.ForbiddenException('You are not authorized to update this comment');
        }
        const { content } = updateCommentInput;
        return await this.prisma.comment.update({
            where: { id },
            data: { content },
        });
    }
    async removeComment(id, user) {
        const comment = await this.findOne(id);
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.authorId !== user.id && user.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You are not authorized to delete this comment');
        }
        return await this.prisma.comment.delete({
            where: { id },
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map