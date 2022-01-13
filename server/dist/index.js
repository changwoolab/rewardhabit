"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const constants_1 = require("./secret_modules/constants");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const apollo_server_core_1 = require("apollo-server-core");
const post_1 = require("./resolvers/post");
const Subscript_1 = require("./entities/Subscript");
const user_1 = require("./resolvers/user");
const User_IV_1 = require("./entities/User_IV");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const test_1 = require("./resolvers/test");
const cors_1 = __importDefault(require("cors"));
const main = async () => {
    await (0, typeorm_1.createConnection)({
        type: 'mysql',
        host: constants_1.DB_HOST,
        port: constants_1.DB_PORT,
        database: constants_1.DB_NAME,
        username: constants_1.DB_USERNAME,
        password: constants_1.DB_PASSWORD,
        synchronize: true,
        entities: [User_1.User, Post_1.Post, Subscript_1.Subscript, User_IV_1.User_IV],
    });
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default();
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 5,
            httpOnly: true,
            sameSite: "lax",
        },
        saveUninitialized: false,
        secret: 'akldjbf123DLSKFN1kljbqwlkjbfksjdfk124jnasjkdfnw',
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [test_1.TestResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res, redis }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)({}),
        ],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map