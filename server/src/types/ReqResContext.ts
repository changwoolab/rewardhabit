import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUpdootLoader } from "../utils/dataLoader/createUpdootLoader";
import { createUserLoader } from "../utils/dataLoader/createUserLoader";

export type ReqResContext = {
    req: Request;
    res: Response;
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    updootLoader: ReturnType<typeof createUpdootLoader>;
}
