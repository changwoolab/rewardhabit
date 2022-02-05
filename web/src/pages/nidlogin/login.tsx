import { Box, Button, Center, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { useLoginMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Layout } from "../../components/Layout";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ userId: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await login(values);
          if (res.error)
            alert("서버 오류가 발생했습니다\n잠시 후 다시 실행해주세요");

          // 로그인 성공!
          if (res.data?.login) {
            // router에 있는 next Query를 받아서 원래 있던 페이지로 돌아가도록 하기
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }

          // 로그인 실패.. ㅠㅠ
          else if (!res.data?.login) {
            alert("아이디 또는 비밀번호가 틀렸습니다");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="userId" label="아이디" />
            <InputField name="password" label="비밀번호" type="password" />
            <Box textAlign={"center"}>
              <Button
                mt={4}
                w={"100%"}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                {" "}
                로그인{" "}
              </Button>
            </Box>
            <Center mt={4}>
              <Link href="/nidlogin/forgot/forgotUserId"> 아이디 찾기 </Link>
              <Link ml={4} href="/nidlogin/forgot/forgotPassword">
                {" "}
                비밀번호 찾기{" "}
              </Link>
            </Center>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
