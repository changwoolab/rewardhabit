import { Field, ObjectType } from "type-graphql";
import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

/** 어떤 유저가 어떤 Post에 투표를 했는지! 일반게시판 전용임. */
@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
    @Field()
    @Column({ type: "int" })
    value: number;

    @Field()
    @PrimaryColumn()
    userId: number;

    @Field(() => User)
    @ManyToOne(() => User, user => user.updoots, {
        onDelete: "CASCADE",
    })
    user: User;
    
    @Field()
    @PrimaryColumn()
    postId: number;

    @Field(() => Post)
    @ManyToOne(() => Post, post => post.updoots, {
        onDelete: "CASCADE",
    })
    post: Post;
}