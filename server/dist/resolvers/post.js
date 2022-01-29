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
const Updoot_1 = require("../entities/Updoot");
const User_1 = require("../entities/User");
const Comment_1 = require("../entities/Comment");
const openaiAPI_1 = require("../utils/openaiAPI");
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
    user(post, { req, userLoader }) {
        if (post.type === 3)
            return userLoader.load(post.userId);
        if (post.type !== 3 && req.session.userId === post.userId)
            return userLoader.load(post.userId);
        return null;
    }
    async voteStatus(post, { req, updootLoader }) {
        const { userId } = req.session;
        if (!userId) {
            return null;
        }
        const updoot = await updootLoader.load({
            postId: post.id,
            userId,
        });
        return updoot ? updoot.value : null;
    }
    async comments(post) {
        const comments = await Comment_1.Comment.find({ postId: post.id });
        return comments;
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
    updoots(post, { req }) {
        if (req.session.userId) {
            return post.updoots;
        }
        return [];
    }
    async vote(postId, value, { req }) {
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;
        const { userId } = req.session;
        const updoot = await Updoot_1.Updoot.findOne({ where: { postId, userId } });
        if (updoot && updoot.value !== realValue) {
            await (0, typeorm_1.getConnection)().transaction(async (tm) => {
                await tm.query(`
                update updoot set value = ? where postId = ? and userId = ?;
                `, [realValue, postId, userId]);
                await tm.query(`
                update post set likes = likes + ? where id = ?;
                `, [2 * realValue, postId]);
            });
        }
        else if (!updoot) {
            await (0, typeorm_1.getConnection)().transaction(async (tm) => {
                await tm.query(`
                insert into updoot (userId, postId, value) values (?, ?, ?);
                `, [userId, postId, realValue]);
                await tm.query(`
                update post set likes = likes + ? where id = ?;
                `, [realValue, postId]);
            });
        }
        return true;
    }
    async posts(limit, cursor) {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const realCursor = cursor ? cursor : new Date;
        const posts = await (0, typeorm_1.getConnection)()
            .getRepository(Post_1.Post)
            .createQueryBuilder("post")
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
    async offsetBasePosts(type, limit, page, { req }) {
        if (page <= 0)
            throw new Error("존재하지 않는 페이지입니다.");
        const { userId } = req.session;
        const offset = (page - 1) * limit + 1;
        let types = [];
        while (type > 0) {
            types.push(type % 10);
            type = parseInt(`${type / 10}`);
        }
        let tm = (0, typeorm_1.getConnection)()
            .getRepository(Post_1.Post)
            .createQueryBuilder("post")
            .where("userId = :userId", { userId });
        types.forEach((value) => {
            tm.andWhere("type = :type", { type: value });
        });
        const posts = await tm.orderBy("post.writtenDate", "DESC")
            .skip(offset)
            .take(limit)
            .getMany();
        console.log(types, limit, page, posts);
        return posts;
    }
    async pagesCount(type, limit, { req }) {
        const { userId } = req.session;
        let tm = (0, typeorm_1.getConnection)()
            .getRepository(Post_1.Post)
            .createQueryBuilder("post")
            .where("userId = :userId", { userId });
        if (type !== 0) {
            tm.andWhere("type = :type", { type });
        }
        const pagesCount = await tm.getCount();
        return Math.ceil(pagesCount / limit);
    }
    async post(id) {
        const post = await Post_1.Post.findOne(id);
        return post;
    }
    async createPost(input, { req }) {
        if (input.type > 3 || input.type <= 0) {
            throw new Error("적절하지 않은 종류를 입력하셨습니다.");
        }
        const { userId } = req.session;
        const user = await User_1.User.findOne({ id: userId });
        if (!user)
            return null;
        const post = await Post_1.Post.create(Object.assign(Object.assign({}, input), { userId })).save();
        if (!post)
            return null;
        if (input.type == 3) {
            const ans = await (0, openaiAPI_1.askOpenAi)(input.texts);
            (0, typeorm_1.getConnection)().transaction(async (tm) => {
                await tm.query(`
                insert into comment (userId, postId, userName, texts) values (?, ?, ?, ?);
                `, [userId, post.id, "OpenAI", ans]);
                await tm.query(`
                update post set commentCount = commentCount + 1 where id = ?;
                `, [post.id]);
            });
        }
        return post;
    }
    async deletePost(id, { req }) {
        const { userId } = req.session;
        const res = await Post_1.Post.delete({ id, userId });
        if (res.affected === 1) {
            return true;
        }
        return false;
    }
    async updatePost(id, title, texts, { req }) {
        const { userId } = req.session;
        const result = await (0, typeorm_1.getConnection)()
            .createQueryBuilder()
            .update(Post_1.Post)
            .set({ title, texts })
            .where("id = :id and userId = :userId", { id, userId })
            .execute();
        if (result.affected === 1) {
            const post = await Post_1.Post.findOne({ id, userId });
            return post ? post : null;
        }
        return null;
    }
    async createComment(postId, texts, { req }) {
        const { userId } = req.session;
        if (!userId)
            return null;
        const user = await User_1.User.findOne({ id: userId });
        if (!user)
            return null;
        await (0, typeorm_1.getConnection)().transaction(async (tm) => {
            await tm.query(`
            insert into comment (userId, postId, userName, texts) values (?, ?, ?, ?);
            `, [userId, postId, user.userName, texts]);
            await tm.query(`
            update post set commentCount = commentCount + 1 where id = ?;
            `, [postId]);
        });
        const post = await Post_1.Post.findOne({ id: postId });
        return post ? post : null;
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
    (0, type_graphql_1.FieldResolver)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => type_graphql_1.Int, { nullable: true }),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "voteStatus", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => [Comment_1.Comment]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "comments", null);
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
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "updoots", null);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Post_1.Post]),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("type", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("page", () => type_graphql_1.Int)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "offsetBasePosts", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_1.Int),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("type", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "pagesCount", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
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
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("title")),
    __param(2, (0, type_graphql_1.Arg)("texts")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("texts")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createComment", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map