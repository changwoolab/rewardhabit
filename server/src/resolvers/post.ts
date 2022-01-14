import { ReqResContext } from "../types/ReqResContext"
import {Resolver, Query, Ctx, Arg, Int, Mutation, InputType, Field, UseMiddleware} from "type-graphql"
import { Post } from "../entities/Post"
import { isAuth } from "../middleware/isAuth";

@InputType()
class PostInput {
    @Field()
    title: string;
    @Field()
    texts: string;
    @Field()
    type: number;
}

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(
        @Ctx() { req }: ReqResContext
    ): Promise<Post[]> {
        const posts = Post.find();
        return posts;
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
            writtenDate: new Date,
        }).save();
    }
}