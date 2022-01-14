import { Box, Button, Center, Flex, Link, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import NextLink from "next/link"
import { DarkModeSwitch } from './DarkModeSwitch';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface navBarProps {}

export const Navbar: React.FC<navBarProps> = ({}) => {
    // 로그인 되어 있다면 유저 정보를 받아오는 쿼리
    const [{data, fetching}] = useMeQuery({
      // SSR로 인해 서버에서 쿠키를 처리하는 일이 없도록 만듦. (서버에는 세션만 있으므로!)
      pause: isServer()
    });
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    let body = null;

    // 로딩중...
    if (fetching) {
      // Not logged in
    } else if (!data?.me?.partialUser) {
        body = (
            <>
            <NextLink href="/nidlogin/login">
              <Link>로그인</Link>
            </NextLink>
            <NextLink href="/nidlogin/register">
              <Link ml={2}>회원가입</Link>
            </NextLink>
            </>
        )
      // Logged in
    } else {
        body = (
            <>
              <Menu>
                <MenuButton as={Button} colorScheme='blue'>
                  {data.me.partialUser.userName}
                </MenuButton>
                <MenuList>
                  <MenuGroup title='Profile'>
                    <MenuItem>My Account</MenuItem>
                    <MenuItem>Payments </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup title='Help'>
                    <MenuItem>Docs</MenuItem>
                    <MenuItem>FAQ</MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
              <Button variant="link" color={"white"} onClick={() => logout()} isLoading={logoutFetching}>로그아웃</Button>
            </>
        )
    }
    return (
        <Flex bg="gray" p={3.5} ml={"auto"}>
          <Link href="/">보상습관</Link>
          <Flex ml={"auto"}>
            {body}
            <DarkModeSwitch />
          </Flex>
        </Flex>
    );
}
