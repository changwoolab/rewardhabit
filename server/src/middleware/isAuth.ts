import { ReqResContext } from "src/types/ReqResContext";
import { MiddlewareFn } from "type-graphql";

// Typegraphql에서 제공하는 특별 함수 이용하여 Middleware를 추가할 수 있음.
// @UseMiddleware을 붙여주면 아래의 함수를 Middleware로 사용할 수 있음.
// 여기서는 Resolver 실행 전에 로그인했는지 확인해주는 middleware 추가함.
export const isAuth: MiddlewareFn<ReqResContext> = ({context}, next) => {
    if (!context.req.session.userId) {
        throw new Error("로그인 되지 않았습니다.")
    }

    return next();
};