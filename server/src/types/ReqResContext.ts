import { Request, Response } from "express";
import { Redis } from "ioredis";

export type ReqResContext = {
    req: Request;
    res: Response;
    redis: Redis;
}
