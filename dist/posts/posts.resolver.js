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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const post_entity_1 = require("./entities/post.entity");
const create_post_input_1 = require("./dto/create-post.input");
const update_post_input_1 = require("./dto/update-post.input");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const posts_service_1 = require("./posts.service");
let PostsResolver = class PostsResolver {
    postsService;
    constructor(postsService) {
        this.postsService = postsService;
    }
    createPost(createPostInput, user) {
        return this.postsService.createPost(createPostInput, user.id);
    }
    findAll() {
        return this.postsService.findAll();
    }
    updatePost(id, updatePostInput, user) {
        return this.postsService.updatePost(id, updatePostInput, user.id);
    }
    removePost(id, user) {
        return this.postsService.removePost(id, user);
    }
    likePost(id, user) {
        return this.postsService.likePost(id, user.id);
    }
    unlikePost(id, user) {
        return this.postsService.unlikePost(id, user.id);
    }
};
exports.PostsResolver = PostsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => post_entity_1.Post),
    __param(0, (0, graphql_1.Args)('createPostInput')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_input_1.CreatePostInput, Object]),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "createPost", null);
__decorate([
    (0, graphql_1.Query)(() => [post_entity_1.Post], { name: 'posts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Mutation)(() => post_entity_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('updatePostInput')),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_post_input_1.UpdatePostInput, Object]),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "updatePost", null);
__decorate([
    (0, graphql_1.Mutation)(() => post_entity_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "removePost", null);
__decorate([
    (0, graphql_1.Mutation)(() => post_entity_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "likePost", null);
__decorate([
    (0, graphql_1.Mutation)(() => post_entity_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsResolver.prototype, "unlikePost", null);
exports.PostsResolver = PostsResolver = __decorate([
    (0, graphql_1.Resolver)(() => post_entity_1.Post),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsResolver);
//# sourceMappingURL=posts.resolver.js.map