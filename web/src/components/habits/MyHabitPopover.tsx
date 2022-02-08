import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  IconButton,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { InputField } from "../InputField";
import { Form, Formik } from "formik";
import { HourMinInput } from "./HourMinInput";
import { SelectHabitColor } from "./SelectHabitColor";
import { DayButton } from "./DayButton";
import { validateHabits } from "../../utils/validateHabits";
import { useDeleteHabitMutation, useEditHabitMutation } from "../../generated/graphql";

interface MyHabitPopoverProps {
  habit: any;
  colorMode: string;
}

/** 습관을 보여주는 Popover, Trigger를 children으로 넣어주면 됩니다. */
export const MyHabitPopover: React.FC<MyHabitPopoverProps> = ({
  habit,
  colorMode,
  children
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

  // 습관 요일 선택 위한 Hook 생성 (8번째(7)는 종일여부)
  let myDays: boolean[] = [];
  for (let i = 0; i < 7; i++) myDays.push(Boolean(Number(habit.habitDay[i])));
  myDays.push(habit.allDay);
  const weekDaysHook = useState<boolean[]>(myDays);

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  let habitDays = [];
  for (let i = 0; i < 7; i++) {
    if (habit.habitDay[i] == "1") habitDays.push(days[i]);
  }

  const [, updateHabit] = useEditHabitMutation();
  const [, deleteHabit] = useDeleteHabitMutation();

  const [editHabit, setEditHabit] = useState<boolean>(false);

  return (
    <Popover placement="auto" closeOnBlur={false}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
        <Formik
          initialValues={myHabitInitialValues}
          onSubmit={async (value) => {
            const validateResult = validateHabits(weekDaysHook[0], value);
            if (!validateResult) return;
            const res = await updateHabit({
              habitId: habit.id,
              habitInput: {
                ...validateResult,
              },
            });
            if (res && !res.error) {
              alert("수정되었습니다");
            }
          }}
        >
          <Form>
            <PopoverHeader pt={4} fontWeight="bold" border="0">
              <Flex
                w="93%"
                justifyContent={"space-between"}
                alignItems="center"
              >
                {!editHabit ? habit.habitName : <InputField mt={1} name="habitName" />}
                <Flex ml={1} mt={3}>
                  <IconButton
                    mr={1}
                    aria-label="delete-habit"
                    colorScheme='blue'
                    size={"sm"}
                    color={"white"}
                    bgColor={"gray.800"}
                    icon={<DeleteIcon/>}
                    onClick={async () => {
                      const really = confirm("정말 삭제하시겠습니까?");
                      if (really) {
                        let res = await deleteHabit({ habitId: habit.id });
                        if (res.data?.deleteHabit) alert("삭제되었습니다");
                      }
                    }}
                  />
                  <IconButton
                    aria-label="edit-habit"
                    colorScheme='blue'
                    size={"sm"}
                    color={"white"}
                    bgColor={"gray.800"}
                    icon={<EditIcon />}
                    onClick={() => {
                      setEditHabit(!editHabit);
                    }}
                  />
                </Flex>
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
                {!editHabit ? null : (
                  <>
                    <DayButton bg={"rgb(59 82 113)"} weekDaysHook={weekDaysHook} day="월" idx={0} />
                    <DayButton bg={"rgb(59 82 113)"} weekDaysHook={weekDaysHook} day="화" idx={1} />
                    <DayButton bg={"rgb(59 82 113)"} weekDaysHook={weekDaysHook} day="수" idx={2} />
                    <DayButton bg={"rgb(59 82 113)"} weekDaysHook={weekDaysHook} day="목" idx={3} />
                    <DayButton bg={"rgb(59 82 113)"} weekDaysHook={weekDaysHook} day="금" idx={4} />
                    <DayButton bg={"rgb(59 82 113)"} weekDaysHook={weekDaysHook} day="토" idx={5} />
                    <DayButton bg={"rgb(59 82 113)"} weekDaysHook={weekDaysHook} day="일" idx={6} />
                  </>
                )}
              </Flex>
              {!editHabit ? null : (
                <Flex mt={1} alignItems={"center"}>
                  <Text fontSize="sm">종일여부 </Text>
                  <DayButton bg={"rgb(59 82 113)"} weekDaysHook={weekDaysHook} day="종일" idx={7} />
                  <SelectHabitColor size={"xs"} colorMode={colorMode}/>
                </Flex>
              )}
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
              {!editHabit ? null : <Button mt={2} bg={"rgb(59 82 113)"} type="submit">저장</Button>}
            </PopoverBody>
          </Form>
        </Formik>
      </PopoverContent>
    </Popover>
  );
};
