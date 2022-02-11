import {
  Box,
  Button,
  Center,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { MyAccountLayout } from "../../components/myAccountLayout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";
import { useMySubscriptQuery } from "../../generated/graphql";
import { ContainerBox } from "../../components/ContainerBox";

interface subscriptProps {}

interface MyAccountSubscriptBoxProps {
  boxContent: string;
  boxTitle: string;
  boxDesc: string;
}

const MyAccountSubscriptBox: React.FC<MyAccountSubscriptBoxProps> = ({
  boxContent,
  boxTitle,
  boxDesc,
}) => {
  return (
    <Box mt={2}>
      <ContainerBox borderColor="gray">
        <Text mt={6} w={"144px"} textAlign="center">
          <strong>{boxTitle}</strong>
        </Text>
        <Box mt={6} mb={7}>
          <Text ml={4}>{boxContent}</Text>
          <Text ml={4} mt={1} fontSize={"xs"} color={"gray"}>
            {boxDesc}
          </Text>
        </Box>
      </ContainerBox>
    </Box>
  );
};

const subscript: React.FC<subscriptProps> = ({}) => {
  const [{ data }] = useMySubscriptQuery();
  const subscript = data?.myAccount.user
    ? data?.myAccount.user?.subscripts
    : null;
  const start = subscript ? subscript.startedAt.slice(0, 10) : "-";
  const end = subscript ? subscript.expireAt.slice(0, 10) : "-";
  // 기간(시작일자~완료일자), 남은일수, 지킨일수, 완료율, 일일반환액, 환급완료금액
  return (
    <MyAccountLayout>
      <Text mb={4} fontSize={"lg"}><strong>내 구독</strong></Text>
      <MyAccountSubscriptBox
        boxTitle="구독 기간"
        boxContent={`${start} ~ ${end}`}
        boxDesc="신청하신 구독 기간입니다."
      />
      <MyAccountSubscriptBox
        boxTitle="환급받은 금액"
        boxContent={`${
          subscript ? String(subscript.reward * subscript.rewardCount) : "-"
        } 원`}
        boxDesc="현재까지 환급받은 총액입니다."
      />
      <MyAccountSubscriptBox
        boxTitle="일일반환액"
        boxContent={`${subscript ? String(subscript.reward) : "-"} 원`}
        boxDesc="습관을 성공적으로 지킬 때마다 반환되는 금액입니다."
      />
      <MyAccountSubscriptBox
        boxTitle="남은 기간"
        boxContent={`${subscript ? String(subscript.daysRemain) : "-"} 일`}
        boxDesc="구독이 끝날 때까지 남은 기간입니다."
      />
      <MyAccountSubscriptBox
        boxTitle="지킨 일수"
        boxContent={`${subscript ? String(subscript.rewardCount) : "-"} 일`}
        boxDesc="습관을 성공적으로 지킨 일수입니다."
      />
      <Center mt={4}>
        <NextLink href="/payment/subscript">
          <Button colorScheme={"teal"}>구독하기/연장하기</Button>
        </NextLink>
      </Center>
    </MyAccountLayout>
  );
};

export default withUrqlClient(createUrqlClient)(subscript);
