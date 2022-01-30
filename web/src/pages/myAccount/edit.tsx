import { Button, Text, Grid, GridItem } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React from 'react';
import { InputField } from '../../components/InputField';
import { Layout } from '../../components/Layout';
import { SideBar } from '../../components/SideBar';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import register from '../nidlogin/register';

interface editAccountProps {}

const editAccount: React.FC<editAccountProps> = ({}) => {
    

    return (
        <>
        <Layout variant="large">
        <Grid templateColumns="1fr 3fr" gap={1}>
          <GridItem>
            <SideBar />
          </GridItem>
          <GridItem>
            <Formik
              initialValues={{ userId: "", password: "", confirmPassword: "", lastName: "", firstName: "", email: "", userName: "", bank: "", account: "" }}
              
              onSubmit={async (values, {setErrors}) => {
                
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
                  <Button m={4} colorScheme='teal' isLoading={isSubmitting} type='submit'> 회원가입 </Button>
                </Form>
              )}
            </Formik>
          </GridItem>
        </Grid>
        </Layout>
        </>
    );
}

export default withUrqlClient(createUrqlClient)(editAccount);