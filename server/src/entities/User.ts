import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Comment } from "./Comment";
import { Habit } from "./Habit";
import { Post } from "./Post";
import { Subscript } from "./Subscript";
import { Updoot } from "./Updoot";

@ObjectType() // Graphql Type으로 Change
@Entity()
export class User extends BaseEntity {
  // BaseEntity로 Active Record를 가능하게 함
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]; // Post에 대한 OneToMany Relation 설정

  @OneToMany(() => Habit, (habit) => habit.user)
  habits: Habit[]; // Post에 대한 OneToMany Relation 설정

  @OneToMany(() => Subscript, (subscript) => subscript.user)
  subscripts: Subscript[]; // Subscript에 대한 OneToMany Relation 설정

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]; // for 내가 쓴 댓글

  @Field()
  @Column({ unique: true })
  userId: string; // 아이디

  @Column()
  password: string; // 비밀번호

  @Field()
  @Column()
  fullName: string; // 이름(성 포함)

  @Field()
  @Column({ unique: true })
  email: string; // 이메일 주소

  @Field()
  @Column({ unique: true })
  userName: string; // 별명

  @Field()
  @Column()
  bank: string; // 은행명

  @Field()
  @Column({ unique: true })
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
