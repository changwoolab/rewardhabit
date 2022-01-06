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
        const post = await Post.findOne({ where: {postId:id} });
        return post;
    }

    // 추후에 수정합시다.
    @Mutation(() => Boolean)
    async createPost(
        @Arg("userId") userId: string,
        @Arg("type") type: number,
        @Arg("title") title: string,
        @Arg("description") description: string,
        @Ctx() { req }: ReqResContext
    ): Promise<boolean> {
        return false;
    }
}