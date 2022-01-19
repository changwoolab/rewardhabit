import { ReqResContext } from "../types/ReqResContext"
import {Resolver, Query, Ctx, Arg, Int, Mutation, InputType, Field, UseMiddleware, FieldResolver, Root} from "type-graphql"
import { Post } from "../entities/Post"
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
    @Field()
    title: string;
    @Field()
    texts: string;
    @Field()
    type: number;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String) // 내 Schema에서 한 Field를 처리할 수 있는 함수를 만들어줌. 여기서는 Post!
    textsSnippet(
        @Root() root: Post, // Post object를 쓸 때마다 FieldResolver를 통해 이걸 쓸 수 있음.
    ) {
        return root.texts.slice(0, 50);
    }

    // 자유게시판 전용, Cursor Pagination
    @Query(() => [Post])
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => Date, {nullable: true}) cursor: Date | null,
        @Ctx() { req }: ReqResContext
    ): Promise<Post[]> {
        const realLimit = Math.min(50, limit);
        // cursor가 null일 때도 쿼리는 실행되어야 하므로 값 지정해주기
        const realCursor = cursor ? cursor : new Date;

        // 자유게시판에 적힌 posts들 가져오기
        return getConnection()
                .getRepository(Post)
                .createQueryBuilder("post")
                .where("type = :type", {type: 3})
                .andWhere("writtenDate < :cursor", { cursor: realCursor })
                .orderBy("writtenDate", "DESC")
                .take(realLimit)
                .getMany()
    }

    @Query(() => Post)
    async post(
        @Arg('id', () => Int) id: number, 
        @Ctx() { req }: ReqResContext
    ): Promise<Post | undefined> {
        const post = await Post.findOne({ where: {postId:id} });
        return post;
    }

    // Post 업로드
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