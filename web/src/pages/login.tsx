import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { Container } from '../components/Container';
import { InputField } from '../components/InputField';
import { Navbar } from '../components/Navbar';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../modules/createUrqlClient';
import { withUrqlClient } from "next-urql"

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();

    return (
    <>
    <Navbar/>
    <Container height="100vh">
    <Wrapper variant='small'>
      <Formik initialValues={{ userId: "", password: "",}} onSubmit={async(values, {setErrors}) => {
          const res = await login(values);
          if (res.error) alert("서버 오류가 발생했습니다\n잠시 후 다시 실행해주세요");

          // 로그인 성공!
          if (res.data?.login) {
            router.push("/");
          } 
          
          // 로그인 실패.. ㅠㅠ
          else if (!res.data?.login) {
            alert("아이디 또는 비밀번호가 틀렸습니다");
          }
        }}>
        {({ isSubmitting }) => (
         <Form>
            <InputField name="userId" label="아이디"/>
            <InputField name="password" label="비밀번호" type="password"/>
            <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'> 로그인 </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
    </Container>
    </>
    );
}

export default withUrqlClient(createUrqlClient)(Login)