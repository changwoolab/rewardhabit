import DataLoader from "dataloader"
import { Updoot } from "../entities/Updoot";


/** 
 * + DataLoader을 만들어서 유저 요청할 때마다 하나하나 SQL문을 생성하지 않고
 * 한번에 묶어서 SQL문을 처리함으로써 데이터 반환을 더 빠르게 해줄 수 있음
 * + 캐시까지 해줌!
 */
export const createUpdootLoader = () => new DataLoader<{userId: number, postId: number}, Updoot | null>(async keys => {
    const updoots = await Updoot.findByIds(keys as any);
    const updootIdsToUpdoot: Record<string, Updoot> = {};
    updoots.forEach(updoot => {
        updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
    })
    return keys.map((key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]);
}); 
