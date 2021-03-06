import { Box, Flex, Link, Text, useColorMode } from "@chakra-ui/react";
import React from "react";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = ({}) => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "#15062c" : "#e6e6e6";
  return (
    <Flex
      justifyContent={"center"}
      bgColor={bgColor}
      h={"100%"}
      w={"100%"}
      left="0"
      bottom={"0"}
    >
      <Box w={"1000px"}>
        <Box m={"30px"}>
          <Text fontSize={"xs"}>
            © All Rights Reserved. 보상습관, Rewardable Habit
          </Text>
          <Text fontSize={"xs"}>Developed by Changwoo Yoo of changwoolab</Text>
          <Flex>
            <Link href="https://github.com/changwoolab">
              <Text fontSize="xs">changwoolab</Text>
            </Link>
            <Link ml={4} href="https://blog.naver.com/cwyoo01">
              <Text fontSize="xs">changwoolab blog</Text>
            </Link>
          </Flex>
        </Box>
        <Box m={"30px"}>
          <Text fontSize={"xs"}>Buy me a coffee!</Text>
          <Flex>
            <Link href="https://github.com/changwoolab">
              <Text fontSize="xs">Kakaopay</Text>
            </Link>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};
