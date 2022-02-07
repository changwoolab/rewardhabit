import { Flex } from '@chakra-ui/react';
import React from 'react';
import { hourSelectOptions, minSelectOptions } from '../../utils/selectOptions';
import { InputField } from '../InputField';

interface HourMinInputProps {
    hourName: string;
    minName: string;
    size: "md" | "sm";
}

export const HourMinInput: React.FC<HourMinInputProps> = ({ hourName, minName, size }) => {
    let w = size === "md" ? "70px" : "64px";
    return (
      <>
        <InputField
          mt={1}
          select
          selectOptions={hourSelectOptions()}
          mySize={size}
          width={w}
          name={hourName}
          placeholder="시"
        />
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          mt={1}
          width={"15px"}
        >
          :
        </Flex>
        <InputField
          mt={1}
          select
          selectOptions={minSelectOptions}
          mySize={size}
          width={w}
          name={minName}
          placeholder="분"
        />
      </>
    );
}