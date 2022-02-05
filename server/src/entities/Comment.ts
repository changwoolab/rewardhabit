import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

/**
 * OPEN AI가 질문하면 댓글을 달아줄거임.
 * 또는 유저들끼리 질문/댓글 일단 가능하게 할건데 인기도는 없을 예정
 * 댓글 수정기능은 없을 것이므로 UpdateDate는 없다.
 */

@ObjectType() // Graphql Type으로 Change
@Entity()
export class Comment extends BaseEntity {
  // BaseEntity로 Active Record를 가능하게 함
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userId: number;

  // 어느 유저가 적었나
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "CASCADE",
  })
  user: User;

  @Field()
  @Column()
  userName: string; // 댓글 보여줄때마다 user entity를 join하는건 너무 비효율적임. 그냥 name 기억

  @Field()
  @Column()
  postId: number;

  // 어느 포스트의 댓글인가
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Field()
  @CreateDateColumn()
  writtenDate: Date; // 작성일자

  @Field()
  @Column("text")
  texts: string; // 내용
}
