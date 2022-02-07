import {
  useBoolean,
  Popover,
  HStack,
  PopoverAnchor,
  Input,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React, { useState } from "react";

interface SelectHabitColorProps {}

export const SelectHabitColor: React.FC<SelectHabitColorProps> = ({}) => {
  const [isEditing, setIsEditing] = useBoolean();
  const [color, setColor] = useState("red");
  const { values } = useFormikContext();
  return (
    <Popover
      isOpen={isEditing}
      onOpen={setIsEditing.on}
      onClose={setIsEditing.off}
      closeOnBlur={false}
      isLazy
      lazyBehavior="keepMounted"
    >
      <HStack>
        <PopoverAnchor>
          <Input
            color={color}
            position="absolute"
            w={"0px"}
            h={"0px"}
            visibility="hidden"
            name="bgColor"
            display="inline-flex"
            isDisabled={!isEditing}
          />
        </PopoverAnchor>

        <PopoverTrigger>
          <Button size="sm" borderRadius={"full"} colorScheme={`${color.split(".")[0]}`}>
            색상
          </Button>
        </PopoverTrigger>
      </HStack>

      <PopoverContent>
        <PopoverBody>
          Colors:
          <RadioGroup
            value={color}
            onChange={(newColor) => {
              (values as any).bgColor = newColor;
              setColor(newColor);
            }}
          >
            <Radio value="red.200">빨강</Radio>
            <Radio value="blue.200">파랑</Radio>
            <Radio value="green.200">초록</Radio>
            <Radio value="purple.200">보라</Radio>
            <Radio value="gray.500">회색</Radio>
            <Radio value="orange.200">주황</Radio>
            <Radio value="yellow.200">노랑</Radio>
            <Radio value="teal.200">청록</Radio>
            <Radio value="cyan.200">시안</Radio>
            <Radio value="pink.200">분홍</Radio>
          </RadioGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
