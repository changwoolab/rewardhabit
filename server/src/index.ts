import "reflect-metadata";
import { createConnection } from "typeorm";
import {DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT} from "./initializer/secret";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { PostResolver } from "./resolvers/post";
import { Subscript } from "./entities/Subscript";

const main = async() => {
    // Typeorm Connection
    await createConnection({
        type: 'mysql',
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        //logging: true,
        synchronize: true, // migration 없이 자동 synchronize
        entities: [User, Post, Subscript],
    });
    // Express
    const app = express();

    // Apollo Server for Graphql
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver],
            validate: false
        }),
        // 모든 Resolver에서 접근 가능하게 만들어줌. => req, res 필요
        context: ({ req, res }) => ({ req, res }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({}),
        ],
    })
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    })
}

main().catch((err) => {
    console.log(err);
});