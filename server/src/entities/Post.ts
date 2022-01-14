import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
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

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @Field()
    @Column()
    writtenDate: Date; // 작성일자

    @Field()
    @Column()
    type: number; // 독서록/일기 여부

    @Field()
    @Column()
    title: string; // 제목

    @Field()
    @Column()
    texts: string; // 내용
}