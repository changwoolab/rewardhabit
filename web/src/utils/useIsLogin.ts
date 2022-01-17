import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";


// 페이지에 들어왔을 때, 로그인이 안되어 있다면 로그인페이지로 보내기
export const useIsLogin = () => {
    const [{data, fetching}] = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        if (!fetching && !data?.me) {
          alert("로그인이 필요한 서비스입니다");
          // 로그인이 끝나면 해당 페이지로 돌아오도록
          router.replace("/nidlogin/login?next=" + router.pathname);
        }
      }, [fetching, data, router]);
}