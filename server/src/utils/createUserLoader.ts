import DataLoader from "dataloader"
import { User } from "../entities/User";


// [1, 7] => [user[id:1], user[id:7]]
/** 
 * + DataLoader을 만들어서 유저 요청할 때마다 하나하나 SQL문을 생성하지 않고
 * 한번에 묶어서 SQL문을 처리함으로써 데이터 반환을 더 빠르게 해줄 수 있음
 * + 캐시까지 해줌!
 */
export const createUserLoader = () => new DataLoader<number, User>(async userIds => {
    const users = await User.findByIds(userIds as number[]);
    const userIdsToUser: Record<number, User> = {};
    users.forEach(u => {
        userIdsToUser[u.id] = u;
    })
    return userIds.map((userId) => userIdsToUser[userId]);
}); 
