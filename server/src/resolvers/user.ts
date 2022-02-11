import {
  Resolver,
  Arg,
  Mutation,
  Query,
  Ctx,
  FieldResolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import { User_IV } from "../entities/User_IV";
import { UserRegisterInput } from "../types/UserRegisterInput";
import { UserResponse } from "../types/UserResponse";
import { createQueryBuilder, getConnection, getRepository, Not } from "typeorm";
import { makeUserAndIV } from "../utils/forUserResolver/makeUserAndIV";
import { notExpectedErr } from "../utils/errors";
import { checkDuplicateRegister } from "../utils/forUserResolver/checkDuplicateRegister";
import argon2 from "argon2";
import { ReqResContext } from "../types/ReqResContext";
import { PartialUser } from "../types/PartialUser";
import { directQuerying } from "../utils/directQuerying";
import { decrypt } from "../utils/encrypt/encrypt";
import {
  COOKIE_NAME,
  FORGOT_PASSWORD_PREFIX,
} from "../secret_modules/constants";
import { sendEmail } from "../utils/sendEmail";
import { emailForm } from "../utils/email/emailForm";
import { v4 } from "uuid";
import { isAuth } from "../middleware/isAuth";
import { decrypeUserInfo } from "../utils/forUserResolver/decryptUserInfo";
import { Subscript } from "../entities/Subscript";
import { MyAccountInput } from "../types/MyAccountInput";
import { EncryptedData } from "../types/Encrypted";

@Resolver(User)
export class UserResolver {
  /** 
    이메일을 볼 때, 자신만 볼 수 있도록 해줌.

    이런 방법이 있다는걸 진작 알았더라면 PartialUser같은건 안만들어도 됐는데....
    근데 뭐 어떤 데이터타입이 있는지도 모르게 해줄라믄 있는것도 나쁘진 않겠다!
     */
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: ReqResContext) {
    // 현재 로그인된 유저와 이메일을 가진 유저가 같다면, return될 수 있도록!
    if (req.session.userId === user.id) return decrypeUserInfo(user, "email");
    // 다른 사람이 어떤 사람의 이메일을 보려 한다면..
    return "";
  }
  /** 은행을 다른 사람이 보는 것을 막음, 나중에 수정 필요(아마 Decrypt 필요할듯) */
  @FieldResolver(() => String)
  async bank(@Root() user: User, @Ctx() { req }: ReqResContext) {
    if (req.session.userId === user.id) return decrypeUserInfo(user, "bank");
    return "";
  }
  @FieldResolver(() => String)
  fullName(@Root() user: User, @Ctx() { req }: ReqResContext) {
    if (req.session.userId === user.id)
      return decrypeUserInfo(user, "fullName");
    return "";
  }
  @FieldResolver(() => String)
  account(@Root() user: User, @Ctx() { req }: ReqResContext) {
    if (req.session.userId === user.id) return decrypeUserInfo(user, "account");
    return "";
  }
  @FieldResolver(() => String)
  registerDate(@Root() user: User, @Ctx() { req }: ReqResContext) {
    if (req.session.userId === user.id) return user.registerDate;
    return "";
  }
  @FieldResolver(() => Subscript, { nullable: true })
  async subscripts(@Root() user: User, @Ctx() { req }: ReqResContext) {
    if (req.session.userId === user.id) {
      const subscript = await Subscript.findOne({ userId: req.session.userId });
      return subscript;
    }
    return null;
  }

  ////////////////////////////////////////////////////////////////////
  ///////////////* 여기부터는 Query 및 Mutation 정의*//////////////////
  ///////////////////////////////////////////////////////////////////

  /** 내 계정 확인 */
  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async myAccount(@Ctx() { req }: ReqResContext) {
    const { userId } = req.session;
    if (!userId) return null;

    const user = await User.findOne({ id: userId });
    if (!user) return null;
    return { user };
  }

  /** 회원탈퇴 */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAccount(
    @Arg("userId") userId: string,
    @Arg("email") email: string,
    @Arg("confirmText") confirmText: string,
    @Arg("password") password: string,
    @Ctx() { req }: ReqResContext
  ): Promise<Boolean> {
    const { userId: id } = req.session;
    if (!id) throw new Error("로그인되지 않았습니다");
    
    const user = await User.findOne({id});
    if (!user) throw new Error("존재하지 않는 아이디입니다");

    // 인풋이 정확한지 검증
    if (userId !== user.userId) throw new Error("아이디를 잘못 입력했습니다");
    if (confirmText !== "보상습관 계정을 삭제합니다") throw new Error("확인문구를 잘못 입력했습니다");
    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new Error("비밀번호를 잘못 입력했습니다");
    const decryptedEmail = await decrypeUserInfo(user, "email");
    if (decryptedEmail !== email) throw new Error("이메일을 잘못 입력했습니다");
    
    const res = await User.delete({id});
    if (res.affected === 1) return true;
    throw new Error("오류가 발생했습니다. 잠시 후 다시 시도해주세요");
  }

  /** 내 계정 업데이트 */
  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updateMyAccount(
    @Arg("inputs") inputs: MyAccountInput,
    @Ctx() { req }: ReqResContext,
  ): Promise<UserResponse> {
    const { userId } = req.session;
    if (!userId) throw new Error("로그인 되어있지 않습니다.");

    // 별명 중복 확인
    const dupUserName = await getConnection()
                          .createQueryBuilder(User, "user")
                          .select("user.userName")
                          .where("userName = :userName", {userName: inputs.userName})
                          .andWhere("id != :id", {id: userId})
                          .getOne();
    if (dupUserName) throw new Error("이미 존재하는 별명입니다.");

    // 계좌번호&이메일 중복 확인 (decryptUserInfo는 user를 가져가기 때문에 overFetching 문제 발생, 따라서 따로 제작)
    const sql = `SELECT email, emailIV, account, accountIV 
                  FROM user JOIN user_iv ON (user.id = user_iv.userId)
                  WHERE user.id != ?;`;
    const users = await getConnection().query(sql, [userId]);
    // Decrypt하여 중복되는지 검사하기
    const mode = ["account", "email"];
    const modeKorean = ["계좌번호", "이메일"]
    for (let key in users) {
        for (let i in mode) {
        let forDecrypte = {
          encryptedData: users[key][mode[i]],
          iv: users[key][mode[i] + "IV"],
        };
        const decryptedUserInfo = decrypt(forDecrypte);
        if (inputs[mode[i]] == decryptedUserInfo) {
          throw new Error(`${modeKorean[i]}이(가) 중복됩니다`);
        }
      }
    }

    // 민감정보 암호화
    const encryptedData = new EncryptedData(inputs);
    const {email, fullName, bank, account} = encryptedData;

    // userIV와 user 모두 업데이트
    // Transaction, 댓글 Insert + Post comment개수 업데이트
    await getConnection().transaction(async (tm) => {
      // 1. userIV 업데이트
      await tm.query(
        `
            update user_iv set emailIV = ?, fullNameIV = ?, bankIV = ?, accountIV = ? where userId = ?;
            `,
        [email.iv, fullName.iv, bank.iv, account.iv, userId]
      );
      // 2. User 업데이트
      await tm.query(
        `
            update user set userName = ?, email = ?, fullName = ?, bank = ?, account = ? where id = ?;
            `,
        [inputs.userName, email.encryptedData, fullName.encryptedData, bank.encryptedData, account.encryptedData, userId]
      );
    });

    // 
    const updatedUser = await User.findOne({id: userId});
    return {user: updatedUser}
  }

  @Query(() => UserResponse, { nullable: true })
  async me(@Ctx() { req }: ReqResContext): Promise<UserResponse | null> {
    if (!req.session.userId) return null;
    const user = await User.findOne({ id: req.session.userId });
    if (!user) return null;
    const partialUser = new PartialUser(user);
    if (!partialUser) return notExpectedErr;
    return { partialUser };
  }

  // Register try-catch 문으로 수정하기! (모든 Error를 처리할 수 있도록..)
  /** 회원가입 */
  @Mutation(() => UserResponse)
  async register(
    @Arg("inputs") inputs: UserRegisterInput
  ): Promise<UserResponse> {
    // 1. 중복된 input이 있는지 한 번 더 검사 (HOXY 모르니)
    const notValid = await checkDuplicateRegister(inputs);
    if (notValid?.errors) {
      return notValid;
    }

    // 2. 주어진 Input을 바탕으로 암호화 된 user 및 iv 객체 만들기
    const { user, iv } = await makeUserAndIV(inputs);
    if (!user || !iv) return notExpectedErr;

    // 3. DB에 저장 -> transaction으로 처리하기
    const resUser = await getRepository(User).save(user);
    if (!resUser) return notExpectedErr;
    const resIV = await getRepository(User_IV).save(iv);
    if (!resIV) {
      // IV가 삽입되지 않은 경우, 방금 삽입한 데이터는 쓸모없어지므로 해당 유저 데이터 삭제
      await User.delete({ userId: user.userId });
      return notExpectedErr;
    }
    const partialUser = new PartialUser(user);
    if (!partialUser) return notExpectedErr;
    return { partialUser };
  }

  /** 로그인 */
  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("userId") userId: string,
    @Arg("password") password: string,
    @Ctx() { req }: ReqResContext
  ): Promise<UserResponse | null> {
    // userid를 찾아보고 없으면 Error return
    const user = await User.findOne({ userId: userId });
    if (!user) return null; // 한 번만 쓰고 싶었지만 아래 user.password 타입을 명확하게 해줘야해서 적음..

    // password validation
    const valid = await argon2.verify(user.password, password);
    if (!valid) return null;

    // Session & Cookie를 설정해준다.
    req.session.userId = user.id;

    const partialUser = new PartialUser(user);
    if (!partialUser) return notExpectedErr;
    return { partialUser };
  }

  // 회원가입 시 userId, userName, Email, Account Field를 입력했을 때 즉시 중복검사를 해주는 Query
  // Query로 할 시, urql useQuery할 때 Variable 속성을 Reexecute로 바꿀 수 없는 문제점이 발생함.
  // 따라서, Mutation으로 하는 수 없이 구현했음.
  /** 즉시 회원가입 인풋 중복 검사 */
  @Mutation(() => Boolean)
  async checkImmediateDuplicate(
    @Arg("mode") mode: string,
    @Arg("input") input: string
  ): Promise<Boolean> {
    // 1. userId, userName 중복 검사
    if (mode == "userId") {
      const user = await User.findOne({ where: { userId: input } });
      if (user) {
        return false;
      }
    } else if (mode == "userName") {
      const user = await User.findOne({ where: { userName: input } });
      if (user) {
        return false;
      }
    }
    // 2. account, email 중복 검사
    else {
      let sql = "";
      if (mode == "account")
        sql =
          "SELECT account, accountIV FROM user JOIN user_iv ON (user.id = user_iv.userId);";
      else if (mode == "email")
        sql =
          "SELECT email, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId);";
      else return false;
      const users = await getConnection().query(sql);
      // Decrypt하여 중복되는지 검사하기
      for (let key in users) {
        let forDecrypte = {
          encryptedData: users[key][mode],
          iv: users[key][mode + "IV"],
        };
        const decryptedUserInfo = decrypt(forDecrypte);
        if (input == decryptedUserInfo) {
          return false;
        }
      }
    }
    return true;
  }

  /** 로그아웃 */
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: ReqResContext) {
    // 1. req.session.destroy()를 통해서 세션을 제거함으로써 로그아웃 가능
    // 단, 위의 req.session.destroy의 콜백함수는 void를 리턴하기 때문에 Boolean을 리턴하기 위해서는 Promise를 만들 필요가 있음.
    return await new Promise((resolve) =>
      req.session.destroy((err) => {
        // 2. 쿠키 제거
        res.clearCookie(COOKIE_NAME);
        // 에러 발생 -> return false
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  /** 아이디 찾기 */
  @Mutation(() => Boolean)
  async forgotUserId(@Arg("email") email: string): Promise<Boolean> {
    if (!email) return false;
    // 이메일이 인풋으로 들어왔을 때 아이디를 찾아야 하므로, userId, email, emailIV를 select
    const sql =
      "SELECT user.userId, email, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId);";
    const users = await directQuerying(sql, []);
    if (!users) return false;
    // 이메일을 Decrypt하여 대응되는 아이디 찾기
    for (let key in users) {
      let beforeDecrypteEmail = {
        encryptedData: users[key].email,
        iv: users[key].emailIV,
      };
      const decryptedEmail = decrypt(beforeDecrypteEmail);
      if (email == decryptedEmail) {
        sendEmail(
          decryptedEmail,
          `[보상습관] 아이디 찾기`,
          emailForm(
            "보상습관 아이디 안내",
            "아이디 찾기를 통해 요청하신 아이디를 알려드립니다.",
            "요청하신 아이디",
            users[key].userId
          )
        );
        return true;
      }
    }
    return false;
  }

  /** 비밀번호 찾기 */
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("userId") userId: string,
    @Arg("email") email: string,
    @Ctx() { redis }: ReqResContext
  ) {
    if (!email || !userId) return false;
    const sql =
      "SELECT user.userId, email, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId) WHERE user.userId = ?;";
    const user = await directQuerying(sql, [userId]);
    if (!user) return false;
    // 이메일을 Decrypt하여 대응되는 아이디 찾기
    let beforeDecrypteEmail = {
      encryptedData: user[0].email,
      iv: user[0].emailIV,
    };
    const decryptedEmail = decrypt(beforeDecrypteEmail);
    if (email == decryptedEmail) {
      // uuid를 이용하여 랜덤 스트링 생성
      const token = v4();

      // Redis에 토큰 및 관련 정보를 함께 저장하기
      // token 앞에 prefix를 붙임으로써 구분할 수 있도록 만들기
      await redis.set(FORGOT_PASSWORD_PREFIX + token, userId, "EX", 60 * 10); // 10분간 토큰 유지

      sendEmail(
        decryptedEmail,
        `[보상습관] 비밀번호 찾기`,
        emailForm(
          "보상습관 비밀번호 안내",
          "비밀번호 찾기를 통해 요청하신 비밀번호 변경 URL을 알려드립니다.",
          "요청하신 URL",
          `<a href="http://localhost:3000/nidlogin/forgot/change-password/${token}">[비밀번호 변경 URL]</a>`
        )
      );
      return true;
    }
    return false;
  }
  /** 비밀번호 변경 */
  @Mutation(() => Boolean)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis }: ReqResContext
  ): Promise<Boolean> {
    // 토큰이 redis에 저장되어 있는지 확인하기
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);
    if (!userId) return false;

    // 새로운 비밀번호 암호화하기
    const hashedNewPassword = await argon2.hash(newPassword);
    if (!hashedNewPassword) return false;

    // 비밀번호 변경하기
    const result = await createQueryBuilder()
      .update(User)
      .set({ password: hashedNewPassword })
      .where("userId = :userId", { userId: "cwyoo0101" })
      .execute();

    // 변경된 것이 1개라면 성공
    if (result.affected == 1) return true;

    // 변경된 것이 없거나 2개 이상이면... -> 오류가 있는 것!
    return false;
  }
}
