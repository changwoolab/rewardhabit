import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from "next/link"
import { DarkModeSwitch } from './DarkModeSwitch';
import { useMeQuery } from '../generated/graphql';

interface navBarProps {}

export const Navbar: React.FC<navBarProps> = ({}) => {
    // 로그인 되어 있다면 유저 정보를 받아오는 쿼리
    const [{data, fetching}] = useMeQuery();
    let body = null;

    // 로딩중...
    if (fetching) {
      // Not logged in
    } else if (!data?.me?.partialUser) {
        body = (
            <>
            <NextLink href="/login">
              <Link>로그인</Link>
            </NextLink>
            <NextLink href="/register">
              <Link ml={2} mr={12}>회원가입</Link>
            </NextLink>
            </>
        )
      // Logged in
    } else {
        body = (
            <Flex mr={12}>
              <Box mr={2}>{data.me.partialUser.userName}</Box>
              <Button variant="link" color={"white"}>로그아웃</Button>
            </Flex>
        )
    }
    return (
        <Flex bg="gray" p={3.5} ml={"auto"}>
          <Box ml={"auto"}>
            {body}
          </Box>
          <DarkModeSwitch />
        </Flex>
    );
}
