import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Navbar } from '../../../components/Navbar';
import Wrapper from '../../../components/Wrapper';
import { useForgotUserIdMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { Container } from '../../../components/Container';

interface forgotUserIdProps {}

const forgotUserId: React.FC<forgotUserIdProps> = ({}) => {
    const [, findUserIdAndSendEmail] = useForgotUserIdMutation();
    return (
        <>
        <Navbar/>
        <Container height="100vh">
        <Wrapper variant='small'>
          <Formik initialValues={{ email: "" }} onSubmit={async(values, {setErrors}) => {
              // 가입할 때 쓴 이메일 주소를 바탕으로 아이디를 찾고, 그 아이디를 이메일로 보내기
              const res = await findUserIdAndSendEmail(values);
              if (!res.data?.forgotUserId) {
                  alert("해당 이메일 주소는 존재하지 않습니다.\n다시 입력해주세요")
              } else {
                  alert("해당 이메일 주소로 아이디를 전송했습니다.\n이메일을 확인해주세요")   
              }
            }}>
            {({ isSubmitting }) => (
             <Form>
                가입 시 사용했던 이메일을 입력해주세요
                <InputField name="email" label="이메일"/>
                <Box textAlign={"center"}>
                  <Button mt={4} w={"100%"} colorScheme='teal' isLoading={isSubmitting} type='submit'> 아이디 찾기 </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Wrapper>
        </Container>
        </>
    );
}

export default withUrqlClient(createUrqlClient)(forgotUserId)