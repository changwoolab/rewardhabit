import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { User } from "./User";


@ObjectType() // Graphql Type으로 Change
@Entity()
export class Subscript extends BaseEntity { // BaseEntity로 Active Record를 가능하게 함
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.subscripts, {
        onDelete: "CASCADE"
    })
    user: User;

    @Field()
    @Column({default: 0})
    type: number; // 패키지타입, 0: 일반, 1~3: 패키지1~3

    @Field()
    @Column()
    startedAt: Date; // 구독시작일자

    @Field()
    @Column()
    expireAt: Date; // 구독만료일자

    @Field()
    @Column()
    reward: number; // 일일반환액

    @Field()
    @Column()
    rewardCount: number; // 보상환급횟수

    @Field()
    @Column()
    totalPayment: number; // 총결제액

    @Field()
    daysRemain: number; // 얼마나 남았는지
}