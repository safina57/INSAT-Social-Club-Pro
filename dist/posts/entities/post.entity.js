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
exports.Post = void 0;
const graphql_1 = require("@nestjs/graphql");
const comment_entity_1 = require("../../comments/entities/comment.entity");
const author_entity_1 = require("../../users/entities/author.entity");
let Post = class Post {
    id;
    content;
    createdAt;
    updatedAt;
    likesCount;
    author;
    authorId;
    comments;
};
exports.Post = Post;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Post.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], Post.prototype, "likesCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => author_entity_1.Author),
    __metadata("design:type", author_entity_1.Author)
], Post.prototype, "author", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Post.prototype, "authorId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [comment_entity_1.Comment], { nullable: true }),
    __metadata("design:type", Object)
], Post.prototype, "comments", void 0);
exports.Post = Post = __decorate([
    (0, graphql_1.ObjectType)()
], Post);
//# sourceMappingURL=post.entity.js.map