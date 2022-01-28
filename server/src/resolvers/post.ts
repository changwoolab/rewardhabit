import { ReqResContext } from "../types/ReqResContext"
import {Resolver, Query, Ctx, Arg, Int, Mutation, InputType, Field, UseMiddleware, FieldResolver, Root, ObjectType} from "type-graphql"
import { Post } from "../entities/Post"
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { Comment } from "../entities/Comment";
import { askOpenAi } from "../utils/openaiAPI";

@InputType()
class PostInput {
    @Field()
    title: string;
    @Field()
    texts: string;
    @Field()
    type: number;
}


@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];
    @Field()
    hasMore: boolean;
}


@Resolver(Post)
export class PostResolver {
    /** Post object를 쓸 때마다 FieldResolver를 통해 이걸 쓸 수 있음. */
    @FieldResolver(() => String) // 내 Schema에서 한 Field를 처리할 수 있는 함수를 만들어줌. 여기서는 Post!
    textsSnippet(
        @Root() root: Post,
    ) {
        return root.texts.slice(0, 50);
    }
    /* 다른 사람이 내 독서록/일기 못보게 함 */
    @FieldResolver(() => User, {nullable: true}) 
    user (
        @Root() post: Post,
        @Ctx() { req, userLoader }: ReqResContext
    ) {
        if (post.type === 3) return userLoader.load(post.userId);
        if (post.type !== 3 && req.session.userId === post.userId) return userLoader.load(post.userId);
        return null;
    }
    @FieldResolver(() => Int, {nullable: true}) 
    async voteStatus (
        @Root() post: Post,
        @Ctx() { req, updootLoader }: ReqResContext
    ) {
        const { userId } = req.session;
        if (!userId) {
            return null;
        }
        const updoot = await updootLoader.load({
            postId: post.id,
            userId,
        })
        return updoot ? updoot.value : null;
    }
    @FieldResolver(() => [Comment]) 
    async comments (
        @Root() post: Post,
    ) {
        // postId를 기반으로 댓글들을 찾아서 return
        const comments = await Comment.find({postId: post.id})
        return comments;
    }
    @FieldResolver(() => String) 
    title (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        // 1. type이 자유게시판이면 -> 그냥 돌려줌
        if (post.type === 3) return post.title;
        // 2. type이 독서/일기이고 자신일 때 -> 돌려줌
        if (post.type !== 3 && req.session.userId === post.userId) return post.title;
        // 3. type이 독서/일기인데 자신이 아닐때
        return "";
    }
    @FieldResolver(() => String) 
    texts (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        if (post.type === 3)  return post.texts
        if (post.type !== 3 && req.session.userId === post.userId) return post.texts;
        return "";
    }
    @FieldResolver(() => String) 
    writtenDate (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        if (post.type === 3) return post.writtenDate
        if (post.type !== 3 && req.session.userId === post.userId) return post.writtenDate;
        return "";
    }
    @FieldResolver(() => String) 
    updateDate (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        if (post.type === 3) return post.updateDate
        if (post.type !== 3 && req.session.userId === post.userId) return post.updateDate;
        return "";
    }
    @FieldResolver(() => String) 
    type (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        if (post.type === 3) return post.type
        if (post.type !== 3 && req.session.userId === post.userId) return post.type;
        return "";
    }
    @FieldResolver(() => String) 
    likes (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        if (post.type === 3) return post.likes
        if (post.type !== 3 && req.session.userId === post.userId) return post.likes;
        return "";
    }
    @FieldResolver(() => String) 
    id (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        if (post.type === 3)  return post.id
        if (post.type !== 3 && req.session.userId === post.userId) return post.id;
        return "";
    }
    @FieldResolver(() => String) 
    userId (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        if (post.type === 3)  return post.userId
        if (post.type !== 3 && req.session.userId === post.userId) return post.userId;
        return "";
    }
    @FieldResolver(() => String) 
    updoots (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        // 로그인 되어있을 때만 updoots 돌려주기
        if (req.session.userId) {
            return post.updoots;
        }
        return [];
    }
    

    ////////////////////////////////////////////////////////////////////
    ///////////////* 여기부터는 Query 및 Mutation 정의*//////////////////
    ///////////////////////////////////////////////////////////////////

    /** Likes 투표 함수 */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote (
        @Arg("postId", () => Int) postId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req }: ReqResContext
    ) {
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;
        const { userId } = req.session;
        const updoot = await Updoot.findOne({ where: {postId, userId} });
        // 1. 유저가 해당 게시물에 (Updoot 후 지금 Downdoot) or (Downdoot 후 지금 Updoot)
        if (updoot && updoot.value !== realValue) {
            await getConnection().transaction(async tm => {
                await tm.query(`
                update updoot set value = ? where postId = ? and userId = ?;
                `, [realValue, postId, userId]);
                // 1 -> -1, -1 -> 1 이어야 하므로 2*realValue
                await tm.query(`
                update post set likes = likes + ? where id = ?;
                `, [2*realValue, postId]);
            });
        } 
        // 2. 투표 취소하기 기능 구현하기
        // 3. 한번도 like표시 안했을 때
        else if (!updoot) {
        /*
            START TRANSACTION;
            insert into updoot (userId, postId, value) values (?, ?, ?);
            update post set likes = likes + ? where id = ?;
            COMMIT;
        */
            await getConnection().transaction(async tm => {
                await tm.query(`
                insert into updoot (userId, postId, value) values (?, ?, ?);
                `, [userId, postId, realValue]);
                await tm.query(`
                update post set likes = likes + ? where id = ?;
                `, [realValue, postId])
            });
        }
        return true;
    }


    /** AI 질문게시판 전용, Cursor Pagination */
    @Query(() => PaginatedPosts)
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => Date, {nullable: true}) cursor: Date | null,
    ): Promise<PaginatedPosts> {
        // 10개를 요청했을 때, 11개를 가져올것임. 이 때 11개보다 적게 오면 더 이상의 데이터는 없다는 뜻
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        // cursor가 null일 때도 쿼리는 실행되어야 하므로값 지정해주기
        const realCursor = cursor ? cursor : new Date;

        // AI 질문게시판에 적힌 posts들 가져오기 (유저정보는 제한적으로만 가져온다)
        const posts = await getConnection()
        .getRepository(Post)
        .createQueryBuilder("post")
        .where("type = :type", {type: 3})
        .andWhere("post.writtenDate < :cursor", { cursor: realCursor })
        .orderBy("post.writtenDate", "DESC")
        .take(realLimitPlusOne)
        .getMany();

        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        }
    }

    /** Mypost 전용, Offset Pagination */
    @Query(() => [Post])
    @UseMiddleware(isAuth)
    async offsetBasePosts(
        @Arg("type", () => Int) type: number,
        @Arg("limit", () => Int) limit: number,
        @Arg("page", () => Int) page: number,
        @Ctx() { req }: ReqResContext
    ): Promise<Post[]> {
        if (page <= 0) throw new Error("존재하지 않는 페이지입니다.");

        const { userId } = req.session;
        const offset = (page - 1) * limit + 1;

        // My posts 가져오기
        let tm = getConnection()
        .getRepository(Post)
        .createQueryBuilder("post")
        .where("userId = :userId", { userId })

        // 0일 때는 모든 타입을 가져옴.
        if (type !== 0) {
            tm.andWhere("type = :type", { type })
        }

        const posts = await tm.orderBy("post.writtenDate", "DESC")
        .skip(offset)
        .take(limit)
        .getMany();

        return posts;
    }

    /** Mypost 전용, Page 개수 가져오기 */
    @Query(() => Int)
    @UseMiddleware(isAuth)
    async pagesCount(
        @Arg("type", () => Int) type: number,
        @Arg("limit", () => Int) limit: number,
        @Ctx() { req }: ReqResContext
    ): Promise<Number> {
        const { userId } = req.session;

        // My posts 개수 가져오기
        let tm = getConnection()
        .getRepository(Post)
        .createQueryBuilder("post")
        .where("userId = :userId", { userId })

        // 0일 때는 모든 타입을 가져옴.
        if (type !== 0) {
            tm.andWhere("type = :type", { type })
        }

        const pagesCount = await tm.getCount();

        return Math.ceil(pagesCount/limit);
    }
 
    @Query(() => Post)
    async post(
        @Arg('id', () => Int) id: number, 
    ): Promise<Post | undefined> {
        const post = await Post.findOne(id);
        return post;
    }

    /** Post 업로드 및 OpenAI 답변 */
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req }: ReqResContext
    ): Promise<Post | null> {
        // 이상한 타입이 들어오면 throw Err
        if (input.type > 3 || input.type <= 0) {
            throw new Error("적절하지 않은 종류를 입력하셨습니다.")
        }

        // 유저 찾기
        const { userId } = req.session;
        const user = await User.findOne({id: userId});
        if (!user) return null;

        // 포스트 올리기.
        const post = await Post.create({
            ...input,
            userId,
        }).save();
        if (!post) return null;

        // AI 질문게시판일 때만 답변 달아주기
        if (input.type == 3) {
            // OPEN AI API 사용하여 답변
            const ans = await askOpenAi(input.texts);
            getConnection().transaction(async tm => {
                await tm.query(`
                insert into comment (userId, postId, userName, texts) values (?, ?, ?, ?);
                `, [userId, post.id, "OpenAI", ans]); // 회원탈퇴할 때 포스트들 및 댓글도 사라지므로 userId는 올린 사람으로 해도 됨.
                await tm.query(`
                update post set commentCount = commentCount + 1 where id = ?;
                `, [post.id])
            });
        }
        return post;
    }

    /** Post 삭제 */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { req }: ReqResContext,
    ):Promise<Boolean> {
        const { userId } = req.session;
        const res = await Post.delete({id, userId});
        if (res.affected === 1) {
            return true;
        }
        return false;
    }

    /** Post 수정 */
    @Mutation(() => Post, {nullable: true})
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("id", () => Int) id: number,
        @Arg("title") title: string,
        @Arg("texts") texts: string,
        @Ctx() { req }: ReqResContext
    ):Promise<Post | null> {
        const { userId } = req.session;
        const result = await getConnection()
        .createQueryBuilder()
        .update(Post)
        .set({title, texts})
        .where("id = :id and userId = :userId", {id, userId})
        .execute();
        if (result.affected === 1) {
            const post = await Post.findOne({id, userId});
            return post ? post : null;
        }
        return null;
    }

     /** 댓글 달기 */
     @Mutation(() => Post, {nullable: true})
     @UseMiddleware(isAuth)
     async createComment(
        @Arg("postId", () => Int) postId: number, // for postId
        @Arg("texts") texts: string, // for Comment 내용
        @Ctx() { req }: ReqResContext // for User
     ):Promise<Post|null> {
        const { userId } = req.session;
        if (!userId) return null;

        const user = await User.findOne({id: userId});
        if(!user) return null;

        // Transaction, 댓글 Insert + Post comment개수 업데이트
        await getConnection().transaction(async tm => {
            await tm.query(`
            insert into comment (userId, postId, userName, texts) values (?, ?, ?, ?);
            `, [userId, postId, user.userName, texts]);
            await tm.query(`
            update post set commentCount = commentCount + 1 where id = ?;
            `, [postId])
        });
        // Post를 넘겨줘서 캐시 업데이트
        const post = await Post.findOne({ id: postId });
        return post ? post : null;
    }
}
