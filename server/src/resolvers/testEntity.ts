import { Resolver, Query } from "type-graphql";
import { TestEntity } from "../entities/TestEntity";

@Resolver()
export class TestEntityResolver {
  @Query(() => TestEntity)
  async test(): Promise<TestEntity|undefined> {
    const test = await TestEntity.findOne({id: 1});
    console.log(test);
    return test;
  }
}
