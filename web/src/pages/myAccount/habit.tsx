import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
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
  useCreateHabitMutation,
  useMyHabitsQuery,
} from "../../generated/graphql";
import { object, string, ValidationError } from "yup";
import { useRouter } from "next/router";

interface habitProps {}

const habit: React.FC<habitProps> = ({}) => {
  const router = useRouter();

  const initialValue = {
    habitDay: "",
    habitName: "",
    habitStart: "",
    habitEnd: "",
  };

  // 다크모드인지 확인 후 색깔 결정
  const { colorMode } = useColorMode();
  const color = colorMode === "dark" ? "white" : "black";

  // MyHabit Hook
  const [{ data: myHabits }] = useMyHabitsQuery();

  // createHabit Hook
  const [, createHabit] = useCreateHabitMutation();

  // 습관 추가 요일 선택
  let days: boolean[] = [];
  for (let i = 0; i < 7; i++) days.push(false);
  const DayButton = (day: string, idx: number) => {
    const [clicked, setClicked] = useState<boolean>(false);
    const color = clicked ? "teal" : undefined;
    return (
      <Button
        size={"sm"}
        colorScheme={color}
        onClick={() => {
          days[idx] = !days[idx];
          setClicked(!clicked);
        }}
      >
        {day}
      </Button>
    );
  };

  // 시간 당 높이
  const heightPerHour = 35;
  /** 시간표 시간대 생성기 */
  const timeTableHours = () => {
    let li = [<Box h={`${heightPerHour}px`}>-</Box>];
    for (let i = 0; i < 24; i++) {
      li.push(
        <Flex
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
  const dayTimeGenerator = (type: string) => {
    if (!myHabits) return undefined;
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
      if (value.habitDay.includes(type))
        habits.push({
          ...value,
          start,
          end,
        });
    });
    // 2. 시작시간순으로 정렬하기
    let sortedHabits = habits.sort((a, b) => a.start - b.start);
    // 3. 시간표 만들기
    let li = [];
    let time = 0;
    let index = 0;
    while (time < 24) {
      if (
        index < sortedHabits.length &&
        Math.floor(sortedHabits[index].start) == Math.floor(time)
      ) {
        let gap = sortedHabits[index].end - sortedHabits[index].start;
        li.push(
          <Flex
            direction="column"
            justifyContent={"center"}
            alignItems={"center"}
            h={`${heightPerHour * gap}px`}
            border="1px"
            borderColor={color}
          >
            <Text fontSize={"5px"}>{sortedHabits[index].habitName}</Text>
            <Text fontSize={"3px"}>
              {sortedHabits[index].habitStart}~{sortedHabits[index].habitEnd}
            </Text>
          </Flex>
        );
        index++;
        time += gap;
        // 입력이 없으면서 time = xx.5인 경우 다시 정수로 맞추기
      } else if (Math.floor(time) != Math.ceil(time)) {
        li.push(
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            h={`${heightPerHour * 0.5}px`}
            borderColor={"white"}
          ></Flex>
        );
        time += 0.5;
      } else {
        li.push(
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            h={`${heightPerHour}px`}
            borderColor={"white"}
          ></Flex>
        );
        time += 1;
      }
    }
    return <>{li}</>;
  };

  const checker = (value: string | undefined) => {
    if (!value) return false;
    const splitted = value.split(":");
    if (!splitted[0] || !splitted[1]) return false;
    if (splitted[0].length != 2 || splitted[1].length != 2) return false;
    if (
      Number(splitted[0]) >= 0 &&
      Number(splitted[0]) <= 23 &&
      Number(splitted[1]) >= 0 &&
      Number(splitted[1]) <= 59
    )
      return true;
    return false;
  };
  const habitValidationSchema = object().shape({
    habitStart: string().test(
      "habitStart",
      "정확히 입력하세요 예)05:30",
      checker
    ),
    habitEnd: string().test("habitEnd", "정확히 입력하세요 예)17:20", checker),
  });

  return (
    <MyAccountLayout>
      <Box>
        <Text>내 습관</Text>
        {!myHabits ? null : (
          <Stack spacing={1}>
            {myHabits?.myHabits.map((p) =>
              !p ? null : (
                <Box key={p.id} p={2} shadow="md" borderwidth="1px">
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

      <Box>
        <Text>내 시간표</Text>
        <Flex justifyContent={"center"}>
          <Box flex={1} textAlign={"center"}>
            {timeTableHours()}
          </Box>
          <Box flex={1} textAlign={"center"}>
            <Text h={`${heightPerHour}px`}>월</Text>
            {dayTimeGenerator("1")}
          </Box>
          <Box flex={1} textAlign={"center"}>
            <Text h={`${heightPerHour}px`}>화</Text>
            {dayTimeGenerator("2")}
          </Box>
          <Box flex={1} textAlign={"center"}>
            <Text h={`${heightPerHour}px`}>수</Text>
            {dayTimeGenerator("3")}
          </Box>
          <Box flex={1} textAlign={"center"}>
            <Text h={`${heightPerHour}px`}>목</Text>
            {dayTimeGenerator("4")}
          </Box>
          <Box flex={1} textAlign={"center"}>
            <Text h={`${heightPerHour}px`}>금</Text>
            {dayTimeGenerator("5")}
          </Box>
          <Box flex={1} textAlign={"center"}>
            <Text h={`${heightPerHour}px`}>토</Text>
            {dayTimeGenerator("6")}
          </Box>
          <Box flex={1} textAlign={"center"}>
            <Text h={`${heightPerHour}px`}>일</Text>
            {dayTimeGenerator("7")}
          </Box>
        </Flex>
      </Box>
      <Box textAlign={"center"}>
        <Text>습관 추가하기</Text>
        <Text>
          시작시간/종료시간 중 하나 이상 입력하지 않으면, "종일"로 구분됩니다
        </Text>
        <Text>종일로 구분되지 않으려면 둘 다 입력해주세요</Text>
        <Text>
          분은 30분 단위로만 입력 가능합니다. 예시) 00:30(O), 00:20(X)
        </Text>
        <Formik
          initialValues={initialValue}
          validationSchema={habitValidationSchema}
          onSubmit={async (value, actions) => {
            let temp = "";
            for (let i = 0; i < 7; i++) {
              if (days[i] === true) temp += `${i + 1}`;
            }
            value.habitDay = temp;
            const res = await createHabit({ habitInput: value });
            if (res) {
              alert("습관이 추가되었습니다");
              actions.resetForm({ values: initialValue });
            }
          }}
        >
          {({ isSubmitting }) => {
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
                          {DayButton("월", 0)}
                          {DayButton("화", 1)}
                          {DayButton("수", 2)}
                          {DayButton("목", 3)}
                        </Flex>
                        <Flex justifyContent={"center"}>
                          {DayButton("금", 4)}
                          {DayButton("토", 5)}
                          {DayButton("일", 6)}
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
                            name="habitName"
                            placeholder="EX) 운동하기"
                          />
                        </Box>
                      </SubscriptBox>
                      <SubscriptBox desc="습관시작시각">
                        <InputField
                          width={"80%"}
                          name="habitStart"
                          placeholder="예시) 05:20"
                        />
                      </SubscriptBox>
                      <SubscriptBox desc="습관종료시각">
                        <InputField
                          width={"80%"}
                          name="habitEnd"
                          placeholder="예시) 17:30"
                        />
                      </SubscriptBox>
                    </Flex>
                    <Box textAlign={"center"}>
                      <Button
                        mb={4}
                        w={"20%"}
                        colorScheme="teal"
                        isLoading={isSubmitting}
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
