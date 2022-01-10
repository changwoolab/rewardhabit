import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();

    return (
    <Wrapper variant='small'>
      <Formik initialValues={{ userId: "", password: "",}} onSubmit={async(values, {setErrors}) => {
          const res = await login(values);
          if (res.error) alert("서버 오류가 발생했습니다\n잠시 후 다시 실행해주세요");
          if (res.data?.login) { // 로그인 성공!
            router.push("/");
          } else if (!res.data?.login) {
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
    );
}

export default Login;