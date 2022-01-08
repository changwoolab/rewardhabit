import { Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import Wrapper from '../components/Wrapper';
import {InputField} from '../components/InputField';
import { object, string, ref } from "yup";
import { useMutation } from 'urql';

const RegisterValidation = object().shape({
    userId: string().required("아이디를 입력해주세요")
              .min(3, "아이디는 3글자 ~ 12글자 사이여야 합니다.").max(12, "아이디는 3글자 ~ 12글자 사이여야 합니다."), 
    password: string().required("비밀번호를 입력해주세요")
              .min(8, "비밀번호는 8글자 ~ 16글자 사이여야 합니다.").max(16, "비밀번호는 8글자 ~ 16글자 사이여야 합니다."), 
    confirmPassword: string().required("비밀번호확인을 입력해주세요").oneOf([ref("password")], "비밀번호가 일치하지 않습니다"), 
    lastName: string().required("성을 입력해주세요"), 
    firstName: string().required("이름을 입력해주세요"), 
    email: string().required("이메일을 입력해주세요").email("유효하지 않은 이메일 주소입니다"), 
    userName: string().required("별명을 입력해주세요")
              .min(2, "별명은 2글자 ~ 8글자 사이여야 합니다.").max(8, "별명은 2글자 ~ 8글자 사이여야 합니다."), 
    bank: string().required("은행명을 입력해주세요"), 
    account: string().required("계좌를 입력해주세요"),
});

interface registerProps {}

// Register validate할 때는 먼저 WEB LEVEL로 Test한 뒤, SERVER LEVEL로 중복검사!
const Register: React.FC<registerProps> = () => {
  const [] = useMutation("");

    return (
        <Wrapper variant='small'>
        <Formik
          initialValues={{ userId: "", password: "", confirmPassword: "", lastName: "", firstName: "", email: "", userName: "", bank: "", account: "" }}
          validationSchema={RegisterValidation}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              actions.setSubmitting(false)
            }, 1000)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
                <InputField name="userId" label="아이디"/>
                <InputField name="password" label="비밀번호" type="password"/>
                <InputField name="confirmPassword" label="비밀번호확인" type="password"/>
                <InputField name="lastName" label="성"/>
                <InputField name="firstName" label="이름"/>
                <InputField name="email" label="이메일 주소"/>
                <InputField name="userName" label="별명"/>
                <InputField name="bank" label="은행명"/>
                <InputField name="account" label="계좌번호"/>
              <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'> 회원가입 </Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

export default Register;
