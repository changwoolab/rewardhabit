import { Box, Button, Center, Flex, Input, Text, useColorMode } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { MyAccountLayout } from '../../components/myAccountLayout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from "next/link"
import { SubscriptBox } from '../../components/SubscriptBox';
import { useMySubscriptQuery } from '../../generated/graphql';

interface subscriptProps {}

const subscript: React.FC<subscriptProps> = ({}) => {
  // 다크모드인지 확인 후 색깔 결정
  const {colorMode} = useColorMode();
  const color = colorMode === "dark" ? "white" : "black";

  // 여러 번 적기 싫어서 정의함
  const ReadOnly = (desc: string, value: string|undefined) => (
    <SubscriptBox desc={desc}>
      <Input w="80%" mt={3} borderColor={color} textAlign={"center"} readOnly value={value}/>
    </SubscriptBox>
  );

  const [{data}] = useMySubscriptQuery();
  const subscript = data?.myAccount.user ? data?.myAccount.user?.subscripts : null;
    return (
        <MyAccountLayout>
          <Box textAlign={"center"}>
            <Text>현재 구독중인 서비스</Text>
          </Box>
          <Box mt={4} borderWidth='1px' borderRadius='lg' overflow='hidden' borderColor={color}>
          <Flex m={4} justifyContent={"center"}>
              {ReadOnly("시작일자", subscript ? subscript.startedAt.slice(0,10) : "-")}
              {ReadOnly("완료일자", subscript ? subscript.expireAt.slice(0,10) : "-")}
              {ReadOnly("일일반환액", subscript ? String(subscript.reward) : "-")}
            </Flex>
          </Box>
          <Box mt={4} borderWidth='1px' borderRadius='lg' overflow='hidden' borderColor={color}>
          <Flex m={4} justifyContent={"center"}>
              {ReadOnly("남은일수", subscript ? String(subscript.daysRemain)+"일" : "-")}
              {ReadOnly("지킨일수", subscript ? String(subscript.rewardCount)+"일" : "-")}
              {ReadOnly("현재까지의 환급 금액", subscript ? String(subscript.reward*subscript.rewardCount) : "-")}
            </Flex>
          </Box>
          <Center mt={4}> 
            <NextLink href="/payment/subscript">
              <Button colorScheme={"teal"}>구독하기/연장하기</Button>
            </NextLink>
          </Center>     
        </MyAccountLayout>
    );
}

export default withUrqlClient(createUrqlClient)(subscript);