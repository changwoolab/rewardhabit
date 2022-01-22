import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";

/** URL을 파싱하여 id를 리턴함. 아이디가 없다면 Return -1 */
export const getIdFromUrl = () => {
    const router = useRouter();
    return typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
}