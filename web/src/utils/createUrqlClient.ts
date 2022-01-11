import { cacheExchange } from '@urql/exchange-graphcache'
import { dedupExchange, fetchExchange } from "urql"
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const // Cookie를 받기 위함
  },
  exchanges: [dedupExchange, cacheExchange({
    // cache를 업데이트할 조건
    updates: {
      Mutation: {
        // result: 지금 cache에 저장되고 있는 모든 API 결과(즉, 방금 막 변한 따끈따끈한 데이터), args: Field가(아래의 login 등이) call될 때 함께 오는 arguments
        // cache: local cache에 접근할 수 있는 방법 제공, info: query document 탐색 정보
        login: (result, args, cache, info) => {
          // Login Mutation이 진행됐을 때 MeQuery Cache Update 진행 (유저 정보가 떠야 하므로..)
          betterUpdateQuery<LoginMutation, MeQuery>(cache, {query: MeDocument}, result, (_result, query) => {
            if (!_result.login) {
              return query; // 로그인 실패... MeQuery는 그대로 유지
            } else {
              return {
                me: _result.login // 로그인 성공! MeQuery 바꿔주기
              }
            }
          })
        },
        register: (result, args, cache, info) => {
          // Login Mutation이 진행됐을 때 MeQuery Cache Update 진행 (유저 정보가 떠야 하므로..)
          betterUpdateQuery<RegisterMutation, MeQuery>(cache, {query: MeDocument}, result, (_result, query) => {
            if (!_result.register) {
              return query; // 회원가입 실패... MeQuery는 그대로 유지
            } else {
              return {
                me: _result.register // 회원가입 성공! MeQuery 바꿔주기
              }
            }
          })
        },
        logout: (result, args, cache, info) => {
          cache.updateQuery({query: MeDocument}, () => {
            return {me: null}
          })
        }
      }
    }
  }), ssrExchange, fetchExchange]
});