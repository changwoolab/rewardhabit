"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const secret_1 = require("./initializer/secret");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const apollo_server_core_1 = require("apollo-server-core");
const post_1 = require("./resolvers/post");
const main = async () => {
    await (0, typeorm_1.createConnection)({
        type: 'mysql',
        host: secret_1.DB_HOST,
        port: secret_1.DB_PORT,
        database: secret_1.DB_NAME,
        username: secret_1.DB_USERNAME,
        password: secret_1.DB_PASSWORD,
        synchronize: true,
        entities: [User_1.User, Post_1.Post],
    });
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [post_1.PostResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)({}),
        ],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map