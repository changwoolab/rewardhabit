import { Center, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from "next/link"
import { DarkModeSwitch } from './DarkModeSwitch';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { UserMenu } from './UserMenu';

interface navBarProps {}

export const Navbar: React.FC<navBarProps> = ({}) => {
    // 로그인 되어 있다면 유저 정보를 받아오는 쿼리
    const [{data, fetching}] = useMeQuery({
      // SSR로 인해 서버에서 쿠키를 처리하는 일이 없도록 만듦. (서버에는 세션만 있으므로!)
      pause: isServer()
    });

    let body = null;
    // 로딩중...
    if (fetching) {
      // Not logged in
    } else if (!data?.me?.partialUser) {
        body = (
            <>
            <Center>
              <NextLink href="/nidlogin/login">
                <Link>로그인</Link>
              </NextLink>
            
              <NextLink href="/nidlogin/register">
                <Link ml={2}>회원가입</Link>
              </NextLink>
            </Center>
            </>
        )
      // Logged in
    } else {
        body = (
          <>
           <NextLink href="/post/create-post">
              <Link alignSelf={"center"} mr={4}>글쓰기</Link>
            </NextLink>
            <UserMenu data={data}/>
          </>
        )
    }
    return (
        <Flex zIndex={1} position="sticky" top={0} bg="gray" p={4} ml={"auto"}>
          <Flex flex={1} m="auto" align="center" maxW={1000}>
          <Center><Heading fontSize="2xl" margin={1}><Link href="/">보상습관</Link></Heading></Center>
          <Flex ml={"auto"}>
          <Center><Link mr={4} href="/post/generalBoard">자유게시판</Link></Center>
            {body}
            <Center><DarkModeSwitch /></Center>
          </Flex>
          </Flex>
        </Flex>
    );
}
