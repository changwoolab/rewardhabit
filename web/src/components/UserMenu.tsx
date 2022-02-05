import {
  Text,
  Menu,
  MenuButton,
  Button,
  MenuList,
  Center,
  MenuGroup,
  MenuItem,
  MenuDivider,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { MeQuery, useLogoutMutation } from "../generated/graphql";
import NextLink from "next/link";

interface UserMenuProps {
  data: MeQuery;
}

export const UserMenu: React.FC<UserMenuProps> = ({ data }) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  // 현재 다크 모드인지 확인
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "dark" ? "white" : "black";

  return (
    <Menu>
      <MenuButton borderRadius={"full"} ml={4} as={Button} bgColor={"#9AE6B4"}>
        {data.me?.partialUser?.userName}
      </MenuButton>
      <MenuList>
        <Center>
          <Text color={bgColor}>포인트</Text>
        </Center>
        <MenuGroup color={bgColor} title="계정">
          <NextLink href="/myAccount/edit">
            <MenuItem color={bgColor}>내 계정</MenuItem>
          </NextLink>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup color={bgColor} title="습관">
          <NextLink href="/myAccount/habit">
            <MenuItem color={bgColor}>내 습관</MenuItem>
          </NextLink>
          <NextLink href="/myAccount/subscript">
            <MenuItem color={bgColor}>내 구독</MenuItem>
          </NextLink>
          <NextLink href="/myAccount/myPost?page=1&limit=10&type=0">
            <MenuItem color={bgColor}>내가 쓴 글</MenuItem>
          </NextLink>
        </MenuGroup>
        <MenuDivider />
        <MenuItem
          color={bgColor}
          onClick={async () => {
            await logout();
          }}
          isLoading={logoutFetching}
        >
          로그아웃
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
