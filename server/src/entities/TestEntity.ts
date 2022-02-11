import { Field, ObjectType } from "type-graphql";
import {
Entity,
PrimaryGeneratedColumn,
Column,
BaseEntity,
} from "typeorm";

@ObjectType() 
@Entity()
export class TestEntity extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    startedAt: Date;

    @Field()
    @Column()
    expireAt: Date;

}
