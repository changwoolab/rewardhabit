import { Request, Response } from "express";

export type ReqResContext = {
    req: Request;
    res: Response;
}
