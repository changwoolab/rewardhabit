import "reflect-metadata";
import { createConnection } from "typeorm";
import {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  COOKIE_NAME,
} from "./secret_modules/constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { PostResolver } from "./resolvers/post";
import { Subscript } from "./entities/Subscript";
import { UserResolver } from "./resolvers/user";
import { User_IV } from "./entities/User_IV";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { ReqResContext } from "./types/ReqResContext";
import cors from "cors";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/dataLoader/createUserLoader";
import { createUpdootLoader } from "./utils/dataLoader/createUpdootLoader";
import { Comment } from "./entities/Comment";
import { SubscriptResolver } from "./resolvers/subscript";
import { Habit } from "./entities/Habit";
import { HabitResolver } from "./resolvers/habit";
import { TestEntity } from "./entities/TestEntity";
import { TestEntityResolver } from "./resolvers/testEntity";

const main = async () => {
  // Typeorm Connection
  const conn = await createConnection({
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    logging: true,
    synchronize: true, // migration 없이 자동 synchronize
    entities: [User, Post, Subscript, User_IV, Updoot, Comment, Habit, TestEntity],
    migrations: [path.join(__dirname, "./migrations/*")], // MOCK DATA Migrations
    multipleStatements: true, // 여러개의 mock data를 넣을 것이므로
  });
  await conn.runMigrations();
  // Express
  const app = express();

  // Redis
  // Apollo에서 Redis를 사용할 것이기 때문에 Apollo보다 먼저 실행되어야하므로 앞에 적어두기.
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // Express 전체에 대해 (모든 Route에 대해) CORS 설정
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Express-session, Session 정의하기
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 5, // 5 hours (1000ms*60*60*5)
        httpOnly: true, // Security! (유저가 Script로 Cookie에 접근 X)
        sameSite: "lax", // Protect from CSRF
        // secure: true // HTTPS에서만 쿠키 전송, Deploy할 때 합시다 지금은 localhost이므로
      },
      saveUninitialized: false,
      secret: "akldjbf123DLSKFN1kljbqwlkjbfksjdfk124jnasjkdfnw", // 어떻게 Cookie를 Assign할지 결정
      resave: false,
    })
  );

  // Apollo Server for Graphql
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        TestEntityResolver,
        PostResolver,
        UserResolver,
        SubscriptResolver,
        HabitResolver,
      ],
      validate: false,
    }),
    // 모든 Resolver에서 접근 가능하게 만들어줌. => req, res 필요 (cookie 정보는 req, res에 담겨있다~)
    context: ({ req, res }): ReqResContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false, // Express 전체에 CORS를 적용해줬으므로 이중으로 적용할 필요는 없음.
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
