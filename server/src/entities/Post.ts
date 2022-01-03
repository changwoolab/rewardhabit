import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";


@ObjectType() // Graphql Type으로 Change
@Entity()
export class Post extends BaseEntity { // BaseEntity로 Active Record를 가능하게 함
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column()
    isActive: boolean;

}