import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class User_IV extends BaseEntity {
  // BaseEntity로 Active Record를 가능하게 함
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Column()
  lastNameIV: string;

  @Column()
  firstNameIV: string;

  @Column()
  emailIV: string;

  @Column()
  bankIV: string;

  @Column()
  accountIV: string;
}
