import {
  AtSignIcon,
  CalendarIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { Link, Button, Flex, useColorMode, Box, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

interface SideBarProps {}

/** 마이페이지 사이드바 */
export const SideBar: React.FC<SideBarProps> = ({}) => {
  const { colorMode } = useColorMode();
  let color = colorMode === "dark" ? "black" : "white";
  return (
    <Flex direction="column">
      <Text ml={5} fontSize="xs">
        계정
      </Text>
      <Flex direction="column">
        <NextLink href="/myAccount/edit">
          <Button m={1} h={35} bgColor={color} justifyContent={"left"}>
            <SettingsIcon mr={4} />내 계정
          </Button>
        </NextLink>
      </Flex>
      <Flex direction="column" mt={"20px"}>
        <Text ml={5} fontSize="xs">
          습관
        </Text>
        <NextLink href="/myAccount/habit">
          <Button m={1} h={35} bgColor={color} justifyContent={"left"}>
            <CalendarIcon mr={4} />내 습관
          </Button>
        </NextLink>
        <NextLink href="/myAccount/subscript">
          <Button m={1} h={35} bgColor={color} justifyContent={"left"}>
            <CheckIcon mr={4} />내 구독
          </Button>
        </NextLink>
        <NextLink href="/myAccount/myPost">
          <Button m={1} h={35} bgColor={color} justifyContent={"left"}>
            <EditIcon mr={4} />
            내 글
          </Button>
        </NextLink>
      </Flex>
      <Flex direction="column" mt={"20px"}>
        <Text ml={5} fontSize="xs">
          포인트
        </Text>
        <NextLink href="/myAccount/point">
          <Button m={1} h={35} bgColor={color} justifyContent={"left"}>
            <AtSignIcon mr={4} />
            포인트
          </Button>
        </NextLink>
      </Flex>
      <Flex direction="column" mt={"20px"}>
        <Text ml={5} fontSize="xs">
          회원탈퇴
        </Text>
        <NextLink href="/myAccount/deleteAccount">
          <Button m={1} h={35} bgColor={color} justifyContent={"left"}>
            <DeleteIcon mr={4} />
            회원탈퇴
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
};
