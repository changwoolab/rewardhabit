import { ReqResContext } from "../types"
import {Resolver, Query, Ctx} from "type-graphql"
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
}