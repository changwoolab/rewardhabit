import { Flex } from '@chakra-ui/react';
import React from 'react';

interface ContainerBoxProps {
    borderColor?: string,
}

export const ContainerBox: React.FC<ContainerBoxProps> = ({
    borderColor,
    children
}) => {
    return (
        <Flex
        borderRadius={"xl"}
        justifyContent={"left"}
        textAlign={"left"}
        border={"1px"}
        borderColor={borderColor}
        w={"100%"}
        >
        {children}
        </Flex>
    );
}