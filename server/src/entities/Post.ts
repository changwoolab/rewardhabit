import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Comment } from "./Comment";
import { Updoot } from "./Updoot";
import { User } from "./User";

@ObjectType() // Graphql Type으로 Change
@Entity()
export class Post extends BaseEntity {
  // BaseEntity로 Active Record를 가능하게 함
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  user: User;

  @Field(() => [Updoot])
  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Field()
  @Column({ type: "int", default: 0 })
  commentCount: number;

  /** 
    페이지에서 무한대로 vote할 수 없게 만들어 줌.
    Column이 아니어서 Post에 따로 저장되지는 않음. 그냥 graphql 전용
    */
  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1 or -1 or null

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
  @Column({ type: "int", default: 0 })
  likes: number; // 자유게시판 전용, 인기도를 나타내기 위함.
}
