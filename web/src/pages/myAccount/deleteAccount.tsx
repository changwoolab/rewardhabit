import { Box, Button, Text, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { MyAccountLayout } from "../../components/myAccountLayout";
import { useDeleteAccountMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface deleteAccountProps {}

const deleteAccount: React.FC<deleteAccountProps> = ({}) => {
  const [, deleteAccount] = useDeleteAccountMutation();
  const router = useRouter()
  return (
    <MyAccountLayout>
      <Box textAlign={"center"}>
      <Text fontSize={"lg"}><strong>회원탈퇴</strong></Text>
      <Text fontSize={"sm"}>회원탈퇴를 하기 위해서는 아이디, 이메일, 확인문구, 비밀번호를 입력해야 합니다.</Text>
      </Box>
      <Flex maxW={"1000px"} justifyContent={"center"}>
        <Formik
          initialValues={{ userId: "", email: "", confirmText: "", password: "" }}
          onSubmit={async (values) => {
            const res = await deleteAccount(values);
            if(res.data?.deleteAccount && !res.error) {
              alert("회원탈퇴 되었습니다.");
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField width={"300px"} name="userId" label="아이디" />
              <InputField width={"300px"} name="email" label="이메일" />
              <InputField
                width={"300px"}
                name="confirmText"
                placeholder="보상습관 계정을 삭제합니다"
                label="확인문구"
              />
              <InputField
                width={"300px"}
                name="password"
                label="비밀번호"
                type="password"
              />
              <Box textAlign={"center"}>
                <Button
                  mt={4}
                  w={"100%"}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  {" "}
                  회원탈퇴{" "}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Flex>
    </MyAccountLayout>
  );
};

export default withUrqlClient(createUrqlClient)(deleteAccount);
