import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../../../components/InputField";
import { useForgotPasswordMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { Layout } from "../../../components/Layout";

interface forgotPasswordProps {}

const forgotPassword: React.FC<forgotPasswordProps> = ({}) => {
  const [, sendChangePasswordEmail] = useForgotPasswordMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ userId: "", email: "" }}
        onSubmit={async (values, { setErrors }) => {
          // 가입할 때 쓴 이메일 주소를 바탕으로 아이디를 찾고, 그 아이디를 이메일로 보내기
          const res = await sendChangePasswordEmail(values);
          if (!res.data?.forgotPassword) {
            alert(
              "아이디 또는 이메일을 잘못 입력하셨습니다.\n다시 입력해주세요"
            );
          } else {
            alert(
              "해당 이메일 주소로 비밀번호 변경 URL을 전송했습니다.\n유효시간은 10분이므로 빠르게 이메일을 확인해주세요"
            );
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            비밀번호를 찾을 아이디 및 이메일을 입력해주세요
            <InputField name="userId" label="아이디" />
            <InputField name="email" label="이메일" />
            <Box textAlign={"center"}>
              <Button
                mt={4}
                w={"100%"}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                {" "}
                비밀번호 찾기{" "}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(forgotPassword);
