import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { MyAccountLayout } from "../../components/myAccountLayout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import { SubscriptBox } from "../../components/SubscriptBox";
import {
  HabitFragFragment,
  useCreateHabitMutation,
  useMyHabitsQuery,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { MyHabitPopover } from "../../components/habits/MyHabitPopover";
import { HourMinInput } from "../../components/habits/HourMinInput";
import { SelectHabitColor } from "../../components/habits/SelectHabitColor";
import { DayButton } from "../../components/habits/DayButton";
import { validateHabits } from "../../utils/validateHabits";
import { MyTimetable } from "../../components/habits/MyTimetable";

export const habitInitialValue = {
  habitDay: "",
  habitName: "",
  startHour: "",
  startMin: "",
  endHour: "",
  endMin: "",
  bgColor: "",
};

export type habitInputFrontEnd = {
  habitDay: string;
  habitName: string;
  startHour: string;
  startMin: string;
  endHour: string;
  endMin: string;
  bgColor: string;
};

interface habitProps {}

const habit: React.FC<habitProps> = ({}) => {
  const router = useRouter();

  // 다크모드인지 확인 후 색깔 결정
  const { colorMode } = useColorMode();
  const color = colorMode === "dark" ? "white" : "black";

  // createHabit Hook
  const [, createHabit] = useCreateHabitMutation();

  // 습관 추가 요일 선택 (8번째(7)는 종일여부)
  let myDays: boolean[] = [];
  for (let i = 0; i < 8; i++) myDays.push(false);
  const weekDaysHook = useState<boolean[]>(myDays);

  // MyHabit Hook
  const [{ data: myHabits }] = useMyHabitsQuery();
  if (!myHabits)
    return (
      <MyAccountLayout>
        <Center>로딩중...</Center>
      </MyAccountLayout>
    );

  // myHabit[0]은 내 습관 왼쪽, [1]은 내 습관 오른쪽
  let myHabit: [HabitFragFragment[], HabitFragFragment[]] = [[], []];
  for (let i = 0; i < myHabits.myHabits.length; i++) {
    myHabit[i % 2].push(myHabits.myHabits[i]);
  }

  return (
    <MyAccountLayout>
      <Box mb={4} textAlign={"center"}>
        <Text mb={4} fontSize={"large"}>
          <strong>내 시간표</strong>
        </Text>
        <MyTimetable colorMode={colorMode} />
      </Box>

      <Flex
        borderRadius={"xl"}
        justifyContent={"left"}
        textAlign={"center"}
        border={"1px"}
        w={"100%"}
      >
        <Box
          borderRadius={"xl"}
          bgColor={colorMode === "dark" ? "gray.600" : "gray.300"}
        >
          <Text m={10}>
            <strong>내 습관</strong>
          </Text>
        </Box>
        {!myHabits ? null : (
          <Flex flex={1} justifyContent={"space-evenly"}>
            {myHabit.map((myHabits, idx) => (
              <Stack m={3} key={"myHabitStack" + idx} spacing={1}>
                {myHabits.map((p) =>
                  !p ? null : (
                    <MyHabitPopover
                      colorMode={colorMode}
                      key={"myHabit" + idx + p.id}
                      habit={p}
                    >
                      <Button
                        key={"myHabits" + p.id}
                        p={2}
                        shadow="md"
                        borderwidth="1px"
                      >
                        <Flex>
                          <Box flex={1} textAlign={"left"}>
                            <Heading fontSize="sm">
                              습관명: {p.habitName}
                            </Heading>
                            <Flex>
                              <Text fontSize="sm">
                                시작시간: {p.habitStart}
                              </Text>
                              <Text fontSize="sm" ml={4}>
                                종료시간: {p.habitEnd}
                              </Text>
                            </Flex>
                          </Box>
                        </Flex>
                      </Button>
                    </MyHabitPopover>
                  )
                )}
              </Stack>
            ))}
          </Flex>
        )}
      </Flex>
      <Box borderRadius={"xl"} mt={8} mb={8} textAlign={"center"}>
        <Text fontSize="xl">
          <strong>습관 추가하기</strong>
        </Text>
        <Text fontSize="sm">
          종일을 선택한 경우, 습관시간은 입력하지 않으셔도 됩니다.
        </Text>
        <Text fontSize="sm">종일습관은 하루 최대 6개씩 추가 가능합니다.</Text>
        <Formik
          initialValues={habitInitialValue}
          onSubmit={async (value, actions) => {
            const validateResult = validateHabits(weekDaysHook[0], value);
            if (!validateResult) return;
            const res = await createHabit({
              habitInput: {
                ...validateResult,
              },
            });
            if (res && !res.error) {
              alert("습관이 추가되었습니다");
              actions.resetForm({ values: habitInitialValue });
            }
          }}
        >
          {(props) => {
            return (
              <>
                <Form>
                  <Box
                    mt={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    borderColor={color}
                  >
                    <Flex m={4} justifyContent={"center"}>
                      <SubscriptBox desc="요일선택">
                        <Flex mt={1} justifyContent={"center"}>
                          <DayButton
                            weekDaysHook={weekDaysHook}
                            day="월"
                            idx={0}
                          />
                          <DayButton
                            weekDaysHook={weekDaysHook}
                            day="화"
                            idx={1}
                          />
                          <DayButton
                            weekDaysHook={weekDaysHook}
                            day="수"
                            idx={2}
                          />
                          <DayButton
                            weekDaysHook={weekDaysHook}
                            day="목"
                            idx={3}
                          />
                        </Flex>
                        <Flex justifyContent={"center"}>
                          <DayButton
                            weekDaysHook={weekDaysHook}
                            day="금"
                            idx={4}
                          />
                          <DayButton
                            weekDaysHook={weekDaysHook}
                            day="토"
                            idx={5}
                          />
                          <DayButton
                            weekDaysHook={weekDaysHook}
                            day="일"
                            idx={6}
                          />
                        </Flex>
                        <InputField
                          mt={1}
                          width={"100%"}
                          name="habitDay"
                          type={"hidden"}
                          readOnly
                        />
                      </SubscriptBox>
                      <SubscriptBox desc="습관명">
                        <Box w="80%" m="auto">
                          <InputField
                            mySize="sm"
                            name="habitName"
                            placeholder="EX) 운동하기"
                          />
                        </Box>
                      </SubscriptBox>
                      <SubscriptBox desc="종일">
                        <Flex
                          mt={4}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <DayButton
                            weekDaysHook={weekDaysHook}
                            day="종일"
                            idx={7}
                          />
                        </Flex>
                      </SubscriptBox>
                      <SubscriptBox desc="습관시작시각">
                        <Flex mt={1} justifyContent={"center"}>
                          <HourMinInput
                            hourName="startHour"
                            minName="startMin"
                            size="sm"
                          />
                        </Flex>
                      </SubscriptBox>
                      <SubscriptBox desc="습관종료시각">
                        <Flex ml={2} mt={1} justifyContent={"center"}>
                          <HourMinInput
                            hourName="endHour"
                            minName="endMin"
                            size="sm"
                          />
                        </Flex>
                      </SubscriptBox>
                      <SelectHabitColor size="sm" colorMode={colorMode} />
                    </Flex>
                    <Box textAlign={"center"}>
                      <Button
                        mb={4}
                        size="sm"
                        w={"20%"}
                        colorScheme="teal"
                        isLoading={props.isSubmitting}
                        type="submit"
                      >
                        습관추가
                      </Button>
                    </Box>
                  </Box>
                </Form>
              </>
            );
          }}
        </Formik>
      </Box>
    </MyAccountLayout>
  );
};

export default withUrqlClient(createUrqlClient)(habit);
