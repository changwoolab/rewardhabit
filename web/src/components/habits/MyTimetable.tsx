import { Text, Flex, Box, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useMyHabitsQuery } from "../../generated/graphql";
import { MyHabitPopover } from "./MyHabitPopover";

interface MyTimetableProps {}

export const MyTimetable: React.FC<MyTimetableProps> = ({}) => {
  // MyHabit Hook
  const [{ data: myHabits }] = useMyHabitsQuery();
  // 다크모드인지 확인 후 색깔 결정
  const { colorMode } = useColorMode();
  const borderColor = colorMode === "dark" ? "#c8c8c8" : "gray";

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

  /** 요일별 시간표 생성기 */
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
        <MyHabitPopover colorMode={colorMode} key={"allDay" + index} habit={sortedHabits[index]}>
          <Flex
            bgColor={
              colorMode === "dark"
                ? sortedHabits[index].bgColor.split(".")[0] + ".700"
                : sortedHabits[index].bgColor
            }
            w="100%"
            as="button"
            direction="column"
            justifyContent={"center"}
            alignItems={"center"}
            h={`${heightPerHour / 2}px`}
            border="1px"
            borderRadius={"sm"}
            borderColor={borderColor}
          >
            <Text fontSize={"5px"}>{sortedHabits[index].habitName}</Text>
            {sortedHabits[index].allDay ? null : (
              <Text fontSize="3px">
                {sortedHabits[index].habitStart}~{sortedHabits[index].habitEnd}{" "}
              </Text>
            )}
          </Flex>
        </MyHabitPopover>
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
          <MyHabitPopover colorMode={colorMode} key={"day" + index} habit={sortedHabits[index]}>
            <Flex
              bgColor={
                colorMode === "dark"
                  ? sortedHabits[index].bgColor.split(".")[0] + ".700"
                  : sortedHabits[index].bgColor
              }
              w="100%"
              as="button"
              direction="column"
              justifyContent={"center"}
              alignItems={"center"}
              h={`${heightPerHour * gap}px`}
              border="1px"
              borderRadius={"sm"}
              borderColor={borderColor}
            >
              <Text fontSize={"5px"}>{sortedHabits[index].habitName}</Text>
              {sortedHabits[index].allDay ? null : (
                <Text fontSize="3px">
                  {sortedHabits[index].habitStart}~
                  {sortedHabits[index].habitEnd}{" "}
                </Text>
              )}
            </Flex>
          </MyHabitPopover>
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
  );
};
