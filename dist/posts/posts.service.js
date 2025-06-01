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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../common/services/base.service");
const role_enum_1 = require("../users/enums/role.enum");
let PostsService = class PostsService extends base_service_1.BaseService {
    constructor(prisma) {
        super(prisma, 'post');
    }
    async createPost(createPostInput, authorId) {
        return await this.prisma.post.create({
            data: {
                ...createPostInput,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
            },
            include: {
                author: true,
            },
        });
    }
    async findAll() {
        return await this.prisma.post.findMany({
            include: {
                author: true,
                comments: {
                    include: {
                        author: true,
                    },
                },
            },
        });
    }
    async updatePost(id, updatePostInput, userId) {
        const post = await this.findOne(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.authorId !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to update this post');
        }
        return await this.prisma.post.update({
            where: { id },
            data: { ...updatePostInput },
            include: {
                author: true,
                comments: true,
            },
        });
    }
    async removePost(id, user) {
        const post = await this.findOne(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.authorId !== user.id && user.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You are not authorized to delete this post');
        }
        return await this.prisma.post.delete({
            where: { id },
        });
    }
    async likePost(id, userId) {
        const post = await this.findOne(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const existingLike = await this.prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id,
                },
            },
        });
        if (existingLike) {
            throw new common_1.ConflictException('You have already liked this post');
        }
        await this.prisma.like.create({
            data: {
                userId,
                postId: id,
            },
        });
        return await this.prisma.post.update({
            where: { id },
            data: {
                likesCount: {
                    increment: 1,
                },
            },
            include: {
                author: true,
                comments: true,
            },
        });
    }
    async unlikePost(id, userId) {
        const post = await this.findOne(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const existingLike = await this.prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id,
                },
            },
        });
        if (!existingLike) {
            throw new common_1.NotFoundException('You have not liked this post');
        }
        await this.prisma.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId: id,
                },
            },
        });
        return await this.prisma.post.update({
            where: { id },
            data: {
                likesCount: {
                    decrement: 1,
                },
            },
            include: {
                author: true,
                comments: true,
            },
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map