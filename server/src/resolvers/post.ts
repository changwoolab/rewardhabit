import { ReqResContext } from "../types"
import {Resolver, Query, Ctx, Arg, Int, Mutation} from "type-graphql"
import { Post } from "../entities/Post"

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
        const post = await Post.findOne({ id });
        return post;
    }
}