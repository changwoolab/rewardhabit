import {
  Box,
  Button,
  Flex,
  Heading,
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
  useCreateHabitMutation,
  useMyHabitsQuery,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import { MyHabitPopover } from "../../components/habits/MyHabitPopover";
import { HourMinInput } from "../../components/habits/HourMinInput";
import { SelectHabitColor } from "../../components/habits/SelectHabitColor";
import { DayButton } from "../../components/habits/DayButton";
import { validateHabits } from "../../utils/validateHabits";

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
  const borderColor = colorMode === "dark" ? "#c8c8c8" : "gray";

  // MyHabit Hook
  const [{ data: myHabits }] = useMyHabitsQuery();

  // createHabit Hook
  const [, createHabit] = useCreateHabitMutation();

  // 습관 추가 요일 선택 (8번째(7)는 종일여부)
  let myDays: boolean[] = [];
  for (let i = 0; i < 8; i++) myDays.push(false);
  const weekDaysHook = useState<boolean[]>(myDays);

  // 시간 당 높이
  const heightPerHour = 35;
  /** 시간표 시간대 생성기 */
  const TimeTableHours = () => {
    let li = [
      <Box key="init" h={`${heightPerHour}px`}>
        -
      </Box>,
    ];
    // 종일 추가
    li.push(
      <Flex
        borderRadius={"sm"}
        border="1px"
        borderColor={borderColor}
        key="allDay"
        justifyContent={"center"}
        alignItems={"center"}
        h={`${heightPerHour * 3}px`}
      >
        종일
      </Flex>
    );
    // 시간 추가
    for (let i = 0; i < 24; i++) {
      li.push(
        <Flex
          borderRadius={"sm"}
          border="1px"
          borderColor={borderColor}
          key={"timetable" + i}
          justifyContent={"center"}
          alignItems={"center"}
          h={`${heightPerHour}px`}
        >
          {i}
        </Flex>
      );
    }
    return <>{li}</>;
  };

  /** 요일별 시간 생성기 */
  const DayTimeGenerator = (type: number) => {
    if (!myHabits || myHabits.myHabits.length == 0) return null;
    // 1. 요일에 type이 포함된 것들만 뽑아내기 + 정렬 위한 인덱싱
    let habits: any[] = [];
    myHabits.myHabits.forEach((value) => {
      let start, end;
      let startSplit = value.habitStart.split(":");
      start = Number(startSplit[0]);
      if (startSplit[1] !== "00") start += 0.5;
      let endSplit = value.habitEnd.split(":");
      end = Number(endSplit[0]);
      if (endSplit[1] !== "00") end += 0.5;
      if (value.habitDay[type] == "1") {
        habits.push({
          ...value,
          start,
          end,
        });
      }
    });
    // 2. 시작시간순으로 정렬하기
    let sortedHabits = habits.sort((a, b) => a.start - b.start);
    // 3. 시간표 만들기
    let li = [];
    let time = 0;
    let index = 0;
    // 3-1. 종일 추가하기
    while (time < 3) {
      // 종일이 아닌게 나온 경우 or 습관이 끝난 경우 반복문 끝내기
      if (sortedHabits.length <= index || !sortedHabits[index].allDay) {
        li.push(
          <Flex
            borderRadius={"sm"}
            border="1px"
            borderColor={borderColor}
            key={"allDay" + index}
            h={`${heightPerHour * (3 - time)}px`}
          ></Flex>
        );
        break;
      }

      li.push(
        <MyHabitPopover
          key={"allDay" + index}
          height={heightPerHour / 2}
          habit={sortedHabits[index]}
        />
      );
      time += 0.5;
      index++;
    }
    // 3-2. 일반 시간표 추가하기
    time = 0;
    while (time < 24) {
      if (
        index < sortedHabits.length &&
        Math.floor(sortedHabits[index].start) == Math.floor(time)
      ) {
        let gap = sortedHabits[index].end - sortedHabits[index].start;
        // 30분 시작인데 time이 30분에 맞춰져있지 않은 경우
        if (
          Math.floor(time) == Math.ceil(time) &&
          Math.floor(sortedHabits[index].start) !=
            Math.ceil(sortedHabits[index].start)
        ) {
          li.push(
            <Flex
              border="1px"
              borderRadius={"sm"}
              borderColor={borderColor}
              key={"0.5day" + index}
              h={`${heightPerHour * 0.5}px`}
            ></Flex>
          );
          time += 0.5;
        }
        li.push(
          <MyHabitPopover
            key={"day" + index}
            height={heightPerHour * gap}
            habit={sortedHabits[index]}
          />
        );
        index++;
        time += gap;
        // 입력이 없으면서 time = xx.5인 경우 다시 정수로 맞추기
      } else if (Math.floor(time) != Math.ceil(time)) {
        li.push(
          <Flex
            borderRadius={"sm"}
            border="1px"
            borderColor={borderColor}
            key={"empty" + time}
            justifyContent={"center"}
            alignItems={"center"}
            h={`${heightPerHour * 0.5}px`}
          ></Flex>
        );
        time += 0.5;
      } else {
        li.push(
          <Flex
            borderRadius={"sm"}
            border="1px"
            borderColor={borderColor}
            key={"empty" + time}
            justifyContent={"center"}
            alignItems={"center"}
            h={`${heightPerHour}px`}
          ></Flex>
        );
        time += 1;
      }
    }
    return <>{li}</>;
  };

  /** 시간표 요일 생성 위함 */
  const dayDays: [number, string][] = [
    [0, "월"],
    [1, "화"],
    [2, "수"],
    [3, "목"],
    [4, "금"],
    [5, "토"],
    [6, "일"],
  ];
  return (
    <MyAccountLayout>
      <Box>
        <Text>내 시간표</Text>
        <Flex
          bgColor={colorMode === "dark" ? "#5a5a5a" : "#bebebe"}
          borderRadius={"sm"}
          border={"1px"}
          justifyContent={"center"}
        >
          <Box flex={1} textAlign={"center"}>
            <TimeTableHours />
          </Box>
          {dayDays.map((value) => (
            <Box key={"days" + value[0]} flex={1} textAlign={"center"}>
              <Text h={`${heightPerHour}px`}>
                <strong>{value[1]}</strong>
              </Text>
              {DayTimeGenerator(value[0])}
            </Box>
          ))}
        </Flex>
      </Box>

      <Box>
        <Text>내 습관</Text>
        {!myHabits ? null : (
          <Stack spacing={1}>
            {myHabits?.myHabits.map((p) =>
              !p ? null : (
                <Box
                  key={"myHabits" + p.id}
                  p={2}
                  shadow="md"
                  borderwidth="1px"
                >
                  <Flex>
                    <Box flex={1}>
                      <Heading fontSize="sm">습관명: {p.habitName}</Heading>
                      <Flex>
                        <Text fontSize="sm">시작시간: {p.habitStart}</Text>
                        <Text fontSize="sm" ml={4}>
                          종료시간: {p.habitEnd}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              )
            )}
          </Stack>
        )}
      </Box>

      <Box mt={2} textAlign={"center"}>
        <Text fontSize="xl">
          <strong>습관 추가하기</strong>
        </Text>
        <Text>종일을 선택한 경우, 습관시간은 입력하지 않으셔도 됩니다.</Text>
        <Text>종일습관은 매일 최대 6개씩 추가 가능합니다.</Text>
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
                      <SelectHabitColor />
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
