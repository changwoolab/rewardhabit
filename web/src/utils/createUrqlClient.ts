import { Cache, cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import {
  DeleteHabitMutationVariables,
  DeletePostMutationVariables,
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";
import gql from "graphql-tag";
import { isServer } from "./isServer";

/** 글로벌 에러 핸들링 */
const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        // 로그인이 안 됐을때,
        if (error?.message.includes("로그인")) {
          alert(error.message.slice(10));
          Router.replace("/nidlogin/login");
        }
        // 구독한 서비스가 아닐 때
        else if (error?.message.includes("구독")) {
          alert(error.message.slice(10));
        }
        // 그냥 일반적인 에러들은 alert 해주기
        else if (error?.message) {
          alert(error.message.slice(10));
        }
      })
    );
  };

// /** Post query 모두 삭제 */
// const invalidateAllPosts = (cache: Cache) => {
//   const allFields = cache.inspectFields("Query");
//   const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
//   fieldInfos.forEach((fi) => {
//     cache.invalidate("Query", "posts", fi.arguments || {});
//   });
// };

/** Query Cache 모두 삭제 */
const invalidateAllQueryCache = (cache: Cache, mode: string) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === mode);
  if (mode === "posts") {
    fieldInfos.forEach((fi) => {
      cache.invalidate("Query", "posts", fi.arguments || {});
    });
  } else {
    fieldInfos.forEach((fi) => {
      cache.invalidate("Query", mode);
    });
  }
};


/**
 * 현재 CursorPagination 작동방식
  1. "더 불러오기" 버튼이 눌릴 때마다 useState를 통해 만들어진 함수에 의해 cursor가 바뀜
  2. 이 바뀐 variable을 가지고 새로 posts query 실행함.
  3. + 쿼리해서 데이터를 가져왔는데 posts field에 이미 캐시된 데이터가 있음 
      + Graphcache는 새로 들어온 데이터와 기존 데이터와의 연관성을 모름
      + info.partial = false여서 이미 있는 데이터가 완벽한줄 앎 
      --> 저장이 안됨
  4. 하지만, 이를 방지하기 위해서 "내가 방금 쿼리한 데이터가 지금 캐시돼 있어?"를 물어봄
  5. 방금 쿼리한 데이터가 없다면 info.partial = True가 됨.
  6. 따라서 info.partial = true이므로 다시 쿼리를 해서 캐시에 저장을 시킴
  7. 이 캐시에 저장된 쿼리 데이터를 concatenate해서 return해줌.

  * Graphcache는 Graphql API를 통해 받을 데이터 타입 및 저장 구조 (a.k.a.Schema)를 미리 정의함으로써 데이터를 Normalize하여 저장함.
  Graphcache 작동 과정
  1. 쿼리를 함.
  2. 쿼리 데이터를 Normalize ( [Key - Field - Value] table로 )
  3. 이 Normalized Data를 저장
  문제는, 내가 넣으려는 Field에 다른 쿼리에 의해 이미 캐시된 데이터가 있다면, 
  지금 새로운 쿼리에 의해 들어온 캐시할 데이터가 기존의 데이터와 어떤 연관성을 가지는지 모름.
      -> 이미 있으므로 그 데이터를 쓰고 캐시가 안 됨, Implicit Changes 발생!
  따라서 Resolver를 정의하여 어떤 데이터와 어떤 연관성을 가지는지를 정의해야 함.
*/
const simpleCursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    // Cache에서 EntityKey(여기선 Query) 내에 있는 모든 Field를 가져옴. (Cache에 있는 모든 쿼리들을 가져옴)
    const allFields = cache.inspectFields(entityKey);
    // allField 중에서 내가 필요한 Info만 골라내기 (posts 쿼리만 골라내기)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // 방금 쿼리한 부분 Key
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // 방금 쿼리한 데이터가 캐시에 저장되어있니...?를 물어봄, 캐시를 뒤져서 방금 쿼리한 데이터가 있는지 검색
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    // 안돼있어!! -> partial = True -> Cache Update!!!
    info.partial = !isItInTheCache;

    // fieldInfos에 있는 정보를 이용하여 cache로부터 data 읽어와서 concatenate
    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      // Query Entity에서 fieldKey 가진 친구 찾기
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      // Query Entity 내의 key를 가진 친구에서 "post" 및 "hasMore" 필드 찾기
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    // concatenate 된 쿼리 데이터를 cache에 저장
    return {
      __typename: "PaginatedPosts", // Full Object를 반환해야 에러가 안남.
      hasMore,
      posts: results,
    };
  };
};

/** UrqlClient를 정의하고 제작함 */
export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer() && ctx && ctx.req) {
    // SSR 모드일 때는 Nextjs는 ctx를 만들어준다. 아닐때는 안만들어줌
    // 따라서 ctx로 SSR인지 한번 더 확인해줄 수 있다.
    // Next.js는 먼저 랜더링 해준 후, 클라이언트에게 보내주기 때문에 isServer가 항상 true임
    cookie = ctx.req.headers.cookie;
  }

  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const, // Cookie를 받기 위함
      headers: cookie ? { cookie } : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
          Updoot: () => null,
          UserResponse: () => null,
        },
        resolvers: {
          // cache에 관한 client-side resolver 정의
          Query: {
            // posts query가 실행될 때마다 cursorPagination을 실행하여 cache에 저장
            posts: simpleCursorPagination(),
          },
        },
        // cache를 업데이트할 조건
        updates: {
          Mutation: {
            // 습관 삭제 시 캐시 업데이트
            deleteHabit: (result, args, cache, info) => {
              cache.invalidate({
                __typename: "Habit",
                id: (args as DeleteHabitMutationVariables).habitId,
              });
            },
            // 습관 추가 시 캐시 업데이트
            createHabit: (result, args, cache, info) => {
              invalidateAllQueryCache(cache, "myHabits");
            },
            // 포스트 삭제 시 캐시 업데이트
            deletePost: (result, args, cache, info) => {
              cache.invalidate({
                __typename: "Post",
                id: (args as DeletePostMutationVariables).id,
              });
            },
            // result: 지금 cache에 저장되고 있는 모든 API 결과(즉, 방금 막 변한 따끈따끈한 데이터), args: Field가(아래의 login 등이) call될 때 함께 오는 arguments
            // cache: local cache에 접근할 수 있는 방법 제공, info: query document 탐색 정보
            login: (result, args, cache, info) => {
              // Login Mutation이 진행됐을 때 MeQuery Cache Update 진행 (유저 정보가 떠야 하므로..)
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (_result, query) => {
                  if (!_result.login) {
                    return query; // 로그인 실패... MeQuery는 그대로 유지
                  } else {
                    return {
                      me: _result.login, // 로그인 성공! MeQuery 바꿔주기
                    };
                  }
                }
              );
              invalidateAllQueryCache(cache, "posts");
              invalidateAllQueryCache(cache, "myHabits");
            },
            // 로그아웃
            logout: (result, args, cache, info) => {
              cache.updateQuery({ query: MeDocument }, () => {
                return { me: null };
              });
              invalidateAllQueryCache(cache, "posts");
              invalidateAllQueryCache(cache, "myHabits");
            },
            // 포스트 올렸을 때, 자동으로 새로고침해서 내가 올린 포스트가 보이도록 + 기존 쿼리는 모두 없애기
            createPost: (result, args, cache, info) => {
              invalidateAllQueryCache(cache, "posts");
            },
            // Updoot 눌렀을 때 즉시 반영, 이 때 캐시 전체를 refresh할 필요는 없으니 fragment만 바꾼다.
            vote: (result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    likes
                    voteStatus
                  }
                `,
                { id: postId } as any
              );
              if (data) {
                // 이미 투표했다면 아무것도 안함.
                if (data.voteStatus === value) {
                  return;
                }
                const newLikes =
                  (data.likes as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      likes
                      voteStatus
                    }
                  `,
                  { id: postId, likes: newLikes, voteStatus: value } as any
                );
              }
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
