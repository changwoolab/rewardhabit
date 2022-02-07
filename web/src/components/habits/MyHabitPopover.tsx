import { EditIcon } from "@chakra-ui/icons";
import {
  Popover,
  Text,
  PopoverTrigger,
  Flex,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  useColorMode,
  IconButton,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import NextLink from "next/link"
import { InputField } from "../InputField";
import { Form, Formik } from "formik";
import { HourMinInput } from "./HourMinInput";
import { SelectHabitColor } from "./SelectHabitColor";

interface MyHabitPopoverProps {
  height: number;
  habit: any;
}


export const MyHabitPopover: React.FC<MyHabitPopoverProps> = ({
  height,
  habit,
}) => {
  const myHabitInitialValues = {
    habitDay: habit.habitDay,
    habitName: habit.habitName,
    startHour: habit.habitStart.split(":")[0],
    startMin: habit.habitStart.split(":")[1],
    endHour: habit.habitEnd.split(":")[0],
    endMin: habit.habitEnd.split(":")[1],
    bgColor: habit.bgColor,
  };

  // 습관 추가 요일 선택 (8번째(7)는 종일여부)
  let addDays: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    addDays.push(Boolean(Number(habit.habitDay[i])));
  } addDays.push(habit.allDay);

  function DayButton(day: string, idx: number, hidden: boolean) {
    const [clicked, setClicked] = useState<boolean>(false);
    const color = addDays[idx] ? "teal" : undefined;
    return (
      <Button
        size={"xs"}
        colorScheme={color}
        borderRadius="full"
        hidden={hidden}
        onClick={() => {
          addDays[idx] = !addDays[idx];
          setClicked(!clicked);
        }}
      >
        {day}
      </Button>
    );
  };

  // 다크모드인지 확인 후 색깔 결정
  const { colorMode } = useColorMode();
  const bgColor =
    colorMode === "dark" ? habit.bgColor.split(".")[0] + ".700" : habit.bgColor;
  const borderColor = colorMode === "dark" ? "#c8c8c8" : "gray";

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  let habitDays = [];
  for (let i = 0; i < 7; i++) {
    if (habit.habitDay[i] == "1") habitDays.push(days[i]);
  }

  const [editHabit, setEditHabit] = useState<boolean>(false);

  return (
    <Popover placement="auto" closeOnBlur={false}>
      <PopoverTrigger>
        <Flex
          bgColor={bgColor}
          w="100%"
          as="button"
          direction="column"
          justifyContent={"center"}
          alignItems={"center"}
          h={`${height}px`}
          border="1px"
          borderRadius={"sm"}
          borderColor={borderColor}
        >
          <Text fontSize={"5px"}>{habit.habitName}</Text>
          {habit.allDay ? null : (
            <Text fontSize="3px">
              {habit.habitStart}~{habit.habitEnd}{" "}
            </Text>
          )}
        </Flex>
      </PopoverTrigger>
      <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
        <Formik
          initialValues={myHabitInitialValues}
          onSubmit={(value) => {
            console.log(value);
          }}
        >
          <Form>
            <PopoverHeader pt={4} fontWeight="bold" border="0">
              <Flex
                w="93%"
                justifyContent={"space-between"}
                alignItems="center"
              >
                {!editHabit ? habit.habitName : <InputField name="habitName" />}
                <IconButton
                  aria-label="edit-habit"
                  icon={<EditIcon />}
                  onClick={() => {
                    setEditHabit(!editHabit);
                  }}
                />
              </Flex>
            </PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Flex>
                <Text>매주</Text>
                {!habitDays || editHabit
                  ? null
                  : habitDays.map((value) => (
                      <Text ml={1} key={"habitDays" + value}>
                        {value}
                      </Text>
                  ))}
                {DayButton("월", 0, !editHabit)}
                {DayButton("화", 1, !editHabit)}
                {DayButton("수", 2, !editHabit)}
                {DayButton("목", 3, !editHabit)}
                {DayButton("금", 4, !editHabit)}
                {DayButton("토", 5, !editHabit)}
                {DayButton("일", 6, !editHabit)}
              </Flex>
              <Flex alignItems={"center"}>
                {!editHabit ? null : <Text fontSize="sm">종일여부 </Text>}
                {DayButton("종일", 7, !editHabit)}
                {!editHabit ? null : <SelectHabitColor />}
              </Flex>
              <Flex>
                {!editHabit ? (
                  habit.allDay ? null : (
                    <Text>
                      시간: {habit.habitStart}~{habit.habitEnd}{" "}
                    </Text>
                  )
                ) : (
                  <Flex flex={1} alignItems={"center"} justifyContent="center">
                    <HourMinInput
                      hourName="startHour"
                      minName="startMin"
                      size="sm"
                    />
                    ~
                    <HourMinInput
                      hourName="endHour"
                      minName="endMin"
                      size="sm"
                    />
                  </Flex>
                )}
              </Flex>
              {!editHabit ? null : <Button type="submit">저장</Button>}
            </PopoverBody>
          </Form>
        </Formik>
      </PopoverContent>
    </Popover>
  );
};
