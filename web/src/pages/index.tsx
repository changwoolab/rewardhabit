import { Box, Button, Center, Flex, Link, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import NextLink from "next/link"

const Index = () => (
  <Layout variant="large">
    <Flex direction={"column"} h={"70vh"} alignItems={"center"} justifyContent={"center"}>
      <Text fontSize={"xl"}>
        <strong>
          changwoolab의 (사실상) 첫 웹입니다. 아직 부족한 점이 많으니 양해 부탁드려요 :)
        </strong>
      </Text>
      <NextLink href={"/post/askaiBoard"}>
      <Button as={Link} mt={4} colorScheme={"teal"}>AI 질문게시판 가기</Button>
      </NextLink>
      <Text>재미로 만든 영어로 AI질문게시판에 글을 쓰면 OPEN AI가 대답해주는 게시판입니다.</Text>
      <br />
      <Text>이 외의 기능은 "마이페이지"에 구현되어있으므로 확인해보세요</Text>
    </Flex>
  </Layout>
);

// withUrqlClient(Client 정보)(페이지)
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
