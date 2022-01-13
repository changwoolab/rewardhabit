import { Box, Button, Center } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { object, string, ref } from "yup";
import { Container } from '../../../../components/Container';
import { InputField } from '../../../../components/InputField';
import { Navbar } from '../../../../components/Navbar';
import Wrapper from '../../../../components/Wrapper';
import { useChangePasswordMutation } from '../../../../generated/graphql';
import { createUrqlClient } from '../../../../utils/createUrqlClient';

const ChangePasswordValidation = object().shape({
    newPassword: string().required("비밀번호를 입력해주세요")
              .min(8, "비밀번호는 8글자 ~ 16글자 사이여야 합니다.").max(16, "비밀번호는 8글자 ~ 16글자 사이여야 합니다.")
              .matches(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/, "특수문자를 하나 이상 포함하여 비밀번호를 만들어주세요"), 
    confirmNewPassword: string().required("비밀번호확인을 입력해주세요").oneOf([ref("newPassword")], "비밀번호가 일치하지 않습니다"), 
})

// Dynamic Route를 가능하게 하는 Next.js! 아래의 getInitialProps로부터 token 받아옴.
const ChangePassword: NextPage<{token: string}> = ({ token }) => {
    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter();

    return (
        <>
        <Navbar/>
        <Container height="100vh">
        <Wrapper variant='small'>
          <Formik validationSchema={ChangePasswordValidation} 
            initialValues={{ newPassword: "", confirmNewPassword: "" }} onSubmit={async(values) => {
              // ChangePassword 요청 보내기
              const toSend = {
                  token: token,
                  newPassword: values.newPassword,
              };
              const res = await changePassword(toSend);
              console.log(res);

              // 결과 처리
              if (!res.data) {
                alert("서버에 이상이 있습니다. 잠시후 다시 시도해주세요");
              } else if (!res.data.changePassword) {
                alert("10분 이상이 지나, 더 이상 유효하지 않은 URL입니다.\n비밀번호 찾기를 다시 진행해주세요.");
              } else {
                alert("비밀번호 변경이 완료되었습니다\n로그인을 진행해주세요.");
                router.push("/");
              }
            }}>
            {({ isSubmitting }) => (
             <Form>
                <Center>변경하시고 싶은 비밀번호를 입력하세요</Center>
                <InputField name="newPassword" label="새 비밀번호" type="password"/>
                <InputField name="confirmNewPassword" label="비밀번호확인" type="password"/>
                <Box textAlign={"center"}>
                  <Button mt={4} w={"100%"} colorScheme='teal' isLoading={isSubmitting} type='submit'>비밀번호 변경</Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Wrapper>
        </Container>
        </>
    );
}

// URL에서 [token] 부분을 위의 본 함수로 보내줌.
ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    }
}

export default withUrqlClient(createUrqlClient)(ChangePassword);