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
exports.CommentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const comments_service_1 = require("./comments.service");
const comment_entity_1 = require("./entities/comment.entity");
const create_comment_input_1 = require("./dto/create-comment.input");
const update_comment_input_1 = require("./dto/update-comment.input");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let CommentsResolver = class CommentsResolver {
    commentsService;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    createComment(createCommentInput, user) {
        return this.commentsService.createComment(createCommentInput, user.id);
    }
    updateComment(id, updateCommentInput, user) {
        return this.commentsService.updateComment(id, updateCommentInput, user.id);
    }
    removeComment(id, user) {
        return this.commentsService.removeComment(id, user);
    }
};
exports.CommentsResolver = CommentsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => comment_entity_1.Comment),
    __param(0, (0, graphql_1.Args)('createCommentInput')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_input_1.CreateCommentInput, Object]),
    __metadata("design:returntype", void 0)
], CommentsResolver.prototype, "createComment", null);
__decorate([
    (0, graphql_1.Mutation)(() => comment_entity_1.Comment),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('updateCommentInput')),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_comment_input_1.UpdateCommentInput, Object]),
    __metadata("design:returntype", void 0)
], CommentsResolver.prototype, "updateComment", null);
__decorate([
    (0, graphql_1.Mutation)(() => comment_entity_1.Comment),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentsResolver.prototype, "removeComment", null);
exports.CommentsResolver = CommentsResolver = __decorate([
    (0, graphql_1.Resolver)(() => comment_entity_1.Comment),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsResolver);
//# sourceMappingURL=comments.resolver.js.map