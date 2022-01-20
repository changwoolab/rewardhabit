import { ReqResContext } from "../types/ReqResContext"
import {Resolver, Query, Ctx, Arg, Int, Mutation, InputType, Field, UseMiddleware, FieldResolver, Root, ObjectType} from "type-graphql"
import { Post } from "../entities/Post"
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

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
    user (
        @Root() post: Post,
        @Ctx() { req }: ReqResContext
    ) {
        if (post.type === 3) return post.user
        if (post.type !== 3 && req.session.userId === post.userId) return post.user;
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
        // 2. 한번도 like표시 안했을 때
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


    /** 자유게시판 전용, Cursor Pagination */
    @Query(() => PaginatedPosts)
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => Date, {nullable: true}) cursor: Date | null,
        @Ctx() { req }: ReqResContext
    ): Promise<PaginatedPosts> {
        // 10개를 요청했을 때, 11개를 가져올것임. 이 때 11개보다 적게 오면 더 이상의 데이터는 없다는 뜻
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const { userId } = req.session;

        // cursor가 null일 때도 쿼리는 실행되어야 하므로 값 지정해주기
        const realCursor = cursor ? cursor : new Date;

        // 자유게시판에 적힌 posts들 가져오기 (유저정보는 제한적으로만 가져온다)
        const posts = await getConnection()
        .getRepository(Post)
        .createQueryBuilder("post")
        .innerJoinAndSelect("post.user", "user", "user.id = post.userId")
        .select(["post", "user.userName", "user.level", "user.id"])
        .where("type = :type", {type: 3})
        .andWhere("post.writtenDate < :cursor", { cursor: realCursor })
        .orderBy("post.writtenDate", "DESC")
        .take(realLimitPlusOne)
        .getMany();

        // voteStatus 추가해주기
        for (let i in posts) {
            const voteStatus = await getConnection().query(
                `select value from updoot where updoot.userId = ? and updoot.postId = ?`,
                [userId, posts[i].id]
            );
            posts[i].voteStatus = voteStatus[0] ? voteStatus[0].value : null;
        }
        // const replacements = [userId, realCursor, realLimitPlusOne]
        // const post = await getConnection().query(
        //     `
        // select post.*,
        // json_object(
        //     "id", user.id,
        //     "userName", user.userName,
        //     "level", user.level
        // ) user,
        // (select value from updoot where updoot.userId = ? and updoot.postId = post.id) voteStatus
        // from post inner join user on user.id = post.userId
        // ${cursor ? `where post.writtenDate < ?` : ``}
        // order by post.writtenDate DESC
        // limit ?
        //     `
        //     , replacements
        // )
        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        }
    }


    @Query(() => Post)
    async post(
        @Arg('id', () => Int) id: number, 
        @Ctx() { req }: ReqResContext
    ): Promise<Post | undefined> {
        const post = await Post.findOne({ where: {postId:id} });
        return post;
    }

    /** Post 업로드 */
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req }: ReqResContext
    ): Promise<Post> {
        // 포스트 올리기.
        return Post.create({
            ...input,
            userId: req.session.userId,
        }).save();
    }
}