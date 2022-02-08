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

interface SelectHabitColorProps {
  colorMode: string;
  size?: string;
}

export const SelectHabitColor: React.FC<SelectHabitColorProps> = ({
  size,
  colorMode,
}) => {
  const [isEditing, setIsEditing] = useBoolean();
  const [color, setColor] = useState(
    colorMode === "dark" ? "red.700" : "red.200"
  );
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
          <Button
            size={size}
            borderRadius={"full"}
            color={colorMode === "dark" ? "white" : "black"}
            bgColor={
              colorMode === "dark"
                ? color.split(".")[0] + ".700"
                : color.split(".")[0] + ".200"
            }
          >
            색상
          </Button>
        </PopoverTrigger>
      </HStack>

      <PopoverContent bg={"gray.700"} borderColor={"gray.700"}>
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
