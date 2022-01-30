import { EditIcon } from '@chakra-ui/icons';
import { Button, Text, Grid, GridItem, Flex, Box, IconButton } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Layout } from '../../components/Layout';
import { SideBar } from '../../components/SideBar';
import { useMyAccountQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface editAccountProps {}

const editAccount: React.FC<editAccountProps> = ({}) => {
    const [accountInfo,] = useMyAccountQuery();
    const [emailEditMode, setEmailEditMode] = useState<"edit"|"readOnly">("readOnly");
    const [bankEditMode, setBankEditMode] = useState<"edit"|"readOnly">("readOnly");
    const [accountEditMode, setAccountEditMode] = useState<"edit"|"readOnly">("readOnly");

    if(!accountInfo.data?.myAccount.user) {
      return (
        <Layout variant="large">Loading...</Layout>
      )
    }
    console.log(accountInfo.data?.myAccount.user);
    return (
        <>
        <Layout variant="large">
        <Grid templateColumns="1fr 3fr" gap={1}>
          <GridItem>
            <SideBar />
          </GridItem>
          <GridItem>
            <Formik
              initialValues={accountInfo.data?.myAccount.user}
              
              onSubmit={async (values, {setErrors}) => {
                
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                    <InputField readOnly name="userId" label="아이디"/>
                    {/* <InputField name="password" label="비밀번호" type="password"/>
                    <InputField name="confirmPassword" label="비밀번호확인" type="password"/> */}
                    <InputField readOnly name="lastName" label="성"/>
                    <InputField readOnly name="firstName" label="이름"/>
                    <Flex>
                      <Box w={"100%"}>
                        {emailEditMode === "readOnly" ? 
                        <InputField readOnly name="email" label="이메일 주소"/>
                        : <InputField color={"orange.400"} name="email" label="이메일 주소"/>}
                      </Box>
                      <IconButton aria-label="edit email" icon={<EditIcon/>} ml={4} alignSelf={"end"} onClick={() => {
                        if (emailEditMode == "readOnly") {
                          setEmailEditMode("edit");
                        } else {
                          setEmailEditMode("readOnly");
                        }
                      }}/>
                    </Flex>
                    <InputField readOnly name="userName" label="별명"/>
                    <Flex>
                      <Box w={"100%"}>
                        {bankEditMode === "readOnly" ?
                        <InputField readOnly name="bank" label="은행명"/>
                        : <InputField color={"orange.400"} name="bank" label="은행명"/>}
                      </Box>
                      <IconButton aria-label="edit email" icon={<EditIcon/>} ml={4} alignSelf={"end"} onClick={() => {
                        if (bankEditMode === "readOnly") {
                          setBankEditMode("edit");
                        } else {
                          setBankEditMode("readOnly");
                        }
                      }}/>
                    </Flex>
                    <Flex>
                      <Box w={"100%"}>
                        {accountEditMode === "readOnly" ?
                        <InputField readOnly name="account" label="계좌번호"/>
                        : <InputField color={"orange.400"} name="account" label="계좌번호"/>
                        }
                      </Box>
                      <IconButton aria-label="edit email" icon={<EditIcon/>} ml={4} alignSelf={"end"} onClick={() => {
                        if (accountEditMode === "readOnly") {
                          setAccountEditMode("edit");
                        } else {
                          setAccountEditMode("readOnly");
                        }
                      }}/>
                    </Flex>
                  <Button m={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>회원정보 수정</Button>
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