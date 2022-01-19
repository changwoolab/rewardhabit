import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn} from "typeorm";
import { User } from "./User";

@ObjectType() // Graphql Type으로 Change
@Entity()
export class Post extends BaseEntity { // BaseEntity로 Active Record를 가능하게 함
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    userId: number;

    @Field()
    @ManyToOne(() => User, user => user.posts)
    user: User;

    @Field()
    @CreateDateColumn()
    writtenDate: Date; // 작성일자

    @Field()
    @CreateDateColumn()
    updateDate: Date; // 수정일자

    @Field()
    @Column()
    type: number; // 독서록/일기/자유게시판 여부

    @Field()
    @Column()
    title: string; // 제목

    @Field()
    @Column("text")
    texts: string; // 내용

    @Field()
    @Column({ type: "int", default: 0})
    likes: number; // 자유게시판 전용, 인기도를 나타내기 위함.
}