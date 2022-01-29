import { Text, Link, Menu, MenuButton, Button, MenuList, Center, MenuGroup, MenuItem, MenuDivider, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { MeQuery, useLogoutMutation } from '../generated/graphql';
import NextLink from "next/link";

interface UserMenuProps {
    data: MeQuery;
}

export const UserMenu: React.FC<UserMenuProps> = ({ data }) => {
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    
    // 현재 다크 모드인지 확인
    const { colorMode } = useColorMode()
    const bgColor = colorMode === "dark" ? "white" : "black";

    return (
        <Menu>
            <MenuButton ml={4} as={Button} colorScheme='blue'>
              {data.me?.partialUser?.userName}
            </MenuButton>
            <MenuList>
            <Center>
              <Text color={bgColor}>포인트</Text>
            </Center>
              <MenuGroup color={bgColor} title='프로필'>
                <MenuItem color={bgColor}>내 프로필</MenuItem>
                <MenuItem color={bgColor}>회원정보 수정</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup color={bgColor} title='독서록/일기'>
                <MenuItem color={bgColor}>
                  <NextLink href="/post/myPost?page=1&limit=10&type=3" as="/post/myPost">
                   <Link>내가 쓴 글</Link>
                  </NextLink>
                </MenuItem>
              </MenuGroup>
              <MenuItem><Link color={bgColor} onClick={async () => {
                  await logout()
                }} isLoading={logoutFetching}>로그아웃</Link></MenuItem>
            </MenuList>
          </Menu>
    );
}