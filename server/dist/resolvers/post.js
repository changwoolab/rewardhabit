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
exports.PostResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const isAuth_1 = require("../middleware/isAuth");
const typeorm_1 = require("typeorm");
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "texts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PostInput.prototype, "type", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedPosts);
let PostResolver = class PostResolver {
    textsSnippet(root) {
        return root.texts.slice(0, 50);
    }
    title(post, { req }) {
        if (post.type === 3)
            return post.title;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.title;
        return "";
    }
    texts(post, { req }) {
        if (post.type === 3)
            return post.texts;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.texts;
        return "";
    }
    writtenDate(post, { req }) {
        if (post.type === 3)
            return post.writtenDate;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.writtenDate;
        return "";
    }
    updateDate(post, { req }) {
        if (post.type === 3)
            return post.updateDate;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.updateDate;
        return "";
    }
    type(post, { req }) {
        if (post.type === 3)
            return post.type;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.type;
        return "";
    }
    likes(post, { req }) {
        if (post.type === 3)
            return post.likes;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.likes;
        return "";
    }
    user(post, { req }) {
        if (post.type === 3)
            return post.user;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.user;
        return "";
    }
    id(post, { req }) {
        if (post.type === 3)
            return post.id;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.id;
        return "";
    }
    userId(post, { req }) {
        if (post.type === 3)
            return post.userId;
        if (post.type !== 3 && req.session.userId === post.userId)
            return post.userId;
        return "";
    }
    async vote(postId, value, { req }) {
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;
        const { userId } = req.session;
        await (0, typeorm_1.getConnection)().query(`
        START TRANSACTION;

        insert into updoot (userId, postId, value) values (?, ?, ?);

        update post
        set likes = likes + ?
        where id = ?;

        COMMIT;
        `, [userId, postId, realValue, realValue, postId]);
        return true;
    }
    async posts(limit, cursor, { req }) {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const realCursor = cursor ? cursor : new Date;
        const posts = await (0, typeorm_1.getConnection)()
            .getRepository(Post_1.Post)
            .createQueryBuilder("post")
            .innerJoinAndSelect("post.user", "user", "user.id = post.userId")
            .select(["post", "user.userName", "user.level", "user.id"])
            .where("type = :type", { type: 3 })
            .andWhere("post.writtenDate < :cursor", { cursor: realCursor })
            .orderBy("post.writtenDate", "DESC")
            .take(realLimitPlusOne)
            .getMany();
        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
    }
    async post(id, { req }) {
        const post = await Post_1.Post.findOne({ where: { postId: id } });
        return post;
    }
    async createPost(input, { req }) {
        return Post_1.Post.create(Object.assign(Object.assign({}, input), { userId: req.session.userId })).save();
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textsSnippet", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "title", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "texts", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "writtenDate", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "updateDate", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "type", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "likes", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "id", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "userId", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("value", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedPosts),
    __param(0, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("cursor", () => Date, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map