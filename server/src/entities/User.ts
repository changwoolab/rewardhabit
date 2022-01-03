import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@ObjectType() // Graphql Type으로 Change
@Entity()
export class User extends BaseEntity { // BaseEntity로 Active Record를 가능하게 함
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique: true})
    userId: string; // 아이디

    @Column()
    password: string; // 비밀번호

    @Field()
    @Column()
    lastName: string; // 성

    @Field()
    @Column()
    firstName: string; // 이름

    @Field()
    @Column({unique: true})
    userName: string; // 별명

    @Field()
    @Column({unique: true})
    account: string; // 계좌번호

    @Field()
    @Column()
    registerDate: Date; //가입일자

    @Field()
    @Column()
    point: number; // 포인트

    @Field()
    @Column()
    level: number; // 레벨

    @Field()
    @Column()
    exp: number; // 경험치
}