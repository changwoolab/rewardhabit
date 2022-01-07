import { Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import Wrapper from '../components/Wrapper';
import {InputField} from '../components/InputField';
import { object, string, ref } from "yup";

const RegisterValidation = object().shape({
    userId: string().required("Required"), 
    password: string().required("Required"), 
    confirmPassword: string().required("Required").oneOf([ref("password")], "비밀번호가 일치하지 않습니다"), 
    lastName: string().required("Required"), 
    firstName: string().required("Required"), 
    email: string().required("Required").email("Valid Required"), 
    userName: string().required("Required"), 
    bank: string().required("Required"), 
    account: string().required("Required"),
})

interface registerProps {
    
}

// Register validate할 때는 먼저 WEB LEVEL로 Test한 뒤, SERVER LEVEL로 중복검사!
const Register: React.FC<registerProps> = () => {
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
              <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'> Submit </Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

export default Register;
