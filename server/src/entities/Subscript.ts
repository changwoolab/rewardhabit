import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { User } from "./User";


@ObjectType() // Graphql Type으로 Change
@Entity()
export class Subscript extends BaseEntity { // BaseEntity로 Active Record를 가능하게 함
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.subscripts, {
        onDelete: "CASCADE"
    })
    user: User;

    @Field()
    @Column()
    type: number; // 독서록/일기 여부

    @Field()
    @Column()
    startedAt: Date; // 구독시작일자

    @Field()
    @Column()
    expireAt: Date; // 구독만료일자

    @Field()
    @Column()
    reward: number; // 보상당환급액

    @Field()
    @Column()
    rewardCount: number; // 보상환급횟수

    @Field()
    @Column()
    totalPayment: number; // 총결제액

    @Field()
    @Column()
    interval: number; // 습관간격
}