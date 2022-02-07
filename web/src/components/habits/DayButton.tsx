import { Button } from '@chakra-ui/react';
import React from 'react';

interface DayButtonProps {
    weekDaysHook: [boolean[], React.Dispatch<React.SetStateAction<boolean[]>>]
    day: string; idx: number;
}

export const DayButton: React.FC<DayButtonProps> = ({
    weekDaysHook, day, idx
}) => {
    const [weekDays, setWeekDays] = weekDaysHook;
    const color = weekDays[idx] ? "teal" : undefined;
    return (
        <Button
          size={"xs"}
          colorScheme={color}
          borderRadius="full"
          onClick={() => {
            weekDays[idx] = !weekDays[idx]
            setWeekDays([...weekDays]); // array에 useState를 쓸 때는 이렇게!
          }}
        >
          {day}
        </Button>
      );
}