import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
} from "typeorm";
import { User } from "./User";

@ObjectType() // Graphql Type으로 Change
@Entity()
export class Habit extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userId: number;

  // 습관은 구독하지 않아도 만들고 체크할 수 있도록 할 것임. 따라서 User와 연결.
  @ManyToOne(() => User, (user) => user.habits, {
    onDelete: "CASCADE",
  })
  user: User;

  // 1. 습관 대상 요일(0000000, 순서대로 월화수목금토일, 월요일만 = 1000000, 화요일만 = 0100000 이런식으로 표시)
  @Field()
  @Column()
  habitDay: string;
  // 2. 습관이름
  @Field()
  @Column()
  habitName: string;
  // 3. 습관 시작 시간 (EX: 17:00, 05:32)
  @Field()
  @Column({ nullable: true })
  habitStart: string;
  // 4. 습관 종료 시간
  @Field()
  @Column({ nullable: true })
  habitEnd: string;
  // 5. 습관 확인 여부 (DEFAULT FALSE)
  @Field()
  @Column({ default: false })
  checked: boolean;
  // 6. 종일여부
  @Field()
  @Column({ default: false })
  allDay: boolean;
  // 7. 배경색깔
  @Field()
  @Column({ nullable: true })
  bgColor: string;
}
