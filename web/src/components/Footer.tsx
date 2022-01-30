import { Box, Flex, Link, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { wrapperSize, WrapperVariant } from './Wrapper';

interface FooterProps {
  variant: WrapperVariant
}

export const Footer: React.FC<FooterProps> = ({ variant }) => {
    const {colorMode} = useColorMode();
    const bgColor = colorMode === "dark" ? "#15062c" : "#f5f5dc"
    return (
        <Flex justifyContent={"center"} bgColor={bgColor} w={"100%"}>
          <Box w={wrapperSize[variant]}>
            <Box m={"30px"}>
              <Text fontSize={"xs"}>© All Rights Reserved. 보상습관, Rewardable Habit</Text>
              <Text fontSize={"xs"}>Developed by Changwoo Yoo of changwoolab</Text>
              <Flex>
                <Link href="https://github.com/changwoolab"><Text fontSize="xs">changwoolab</Text></Link>
                <Link ml={4} href="https://blog.naver.com/cwyoo01"><Text fontSize="xs">changwoolab blog</Text></Link>
              </Flex>
            </Box>
            <Box m={"30px"}>
              <Text fontSize={"xs"}>Buy me a coffee!</Text>
              <Flex>
                <Link href="https://github.com/changwoolab"><Text fontSize="xs">Kakaopay</Text></Link>
              </Flex>
            </Box>
          </Box>
        </Flex>
    );
}