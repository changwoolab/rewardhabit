import { QueryInput, Cache } from "@urql/exchange-graphcache";

// exchanges에서 타입을 맞추기 어렵기 때문에 cumtomize함.
export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  targetQuery: QueryInput,
  result: any,
  updateFunction: (r: Result, q: Query) => Query
) {
  // updateFunction을 이용하여 targetQuery의 데이터 업데이트 (Cache update)
  return cache.updateQuery(
    targetQuery,
    (data) => updateFunction(result, data as any) as any
  );
}
