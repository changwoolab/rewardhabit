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
} from "@chakra-ui/react";
import React from "react";

interface MyHabitPopoverProps {
  height: number;
  habit: any;
}

export const MyHabitPopover: React.FC<MyHabitPopoverProps> = ({
  height,
  habit,
}) => {
  // 다크모드인지 확인 후 색깔 결정
  const { colorMode } = useColorMode();
  const color = colorMode === "dark" ? "white" : "black";
  const bgColor =
    colorMode === "dark" ? habit.bgColor.split(".")[0] + ".700" : habit.bgColor;
  const borderColor = colorMode === "dark" ? "#c8c8c8" : "gray";

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  let habitDays = [];
  for (let i = 0; i < habit.habitDay.length; i++) {
    habitDays.push(days[Number(habit.habitDay[i]) - 1]);
  }
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
        <Flex>
          <PopoverHeader pt={4} fontWeight="bold" border="0">
            {habit.habitName}
          </PopoverHeader>
        </Flex>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Flex>
            <Text>매주</Text>
            {!habitDays
              ? null
              : habitDays.map((value) => (
                  <Text ml={1} key={"habitDays" + value}>
                    {value}
                  </Text>
                ))}
          </Flex>
          <Flex>
            {habit.allDay ? null : (
              <Text>
                시간: {habit.habitStart}~{habit.habitEnd}{" "}
              </Text>
            )}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
