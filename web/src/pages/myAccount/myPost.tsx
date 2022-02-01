import { Box, Button, Center, Checkbox, Flex, Grid, GridItem, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { useOffsetBasePostsQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from "next/link"
import { PageButtons } from '../../components/PageButtons';
import { EditDeleteButton } from '../../components/CEDButton';
import { Formik, Form, Field } from 'formik';
import { SideBar } from '../../components/SideBar';
import { MyAccountLayout } from '../../components/myAccountLayout';


interface myPostProps {}

const myPost: React.FC<myPostProps> = ({}) => {
    const router = useRouter();
    const [optionState, setOptionState] = useState<"show-option" | "hide-option">("hide-option");

    // Query 가져오기 (String이어서 하나하나 따로 받음)
    let page = Number(router.query.page);
    let limit = Number(router.query.limit);
    let type = Number(router.query.type);
    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!type) type = 0;


    const [{data, fetching}] = useOffsetBasePostsQuery({variables: { type, limit, page }});
    if (!data || !data.offsetBasePosts) {
        return (
        <Layout variant="regular">
            <Center>Loading...</Center>
        </Layout>);
    }

    // height 설정해주기
    let height = "100%"
    if (data.offsetBasePosts.length < 6) {
        height = "120vh"
    };
    
    return (
      <MyAccountLayout>
          <Box textAlign={"center"} flex={1}>
            <Button mb={4} onClick={() => {
                if (optionState === "hide-option") {
                    setOptionState("show-option");
                } else {
                    setOptionState("hide-option")
                }
            }}>옵션</Button>
            {optionState === "hide-option" ? null : (
              <Box>
                <Formik initialValues={{ type1: "", type2: "", type3: "", limit: limit}}
                    onSubmit={(value) => {
                        let typeInfo = value.type1 + value.type2 + value.type3;
                        if (!typeInfo) {
                          typeInfo = "0";
                        }
                        router.push(`/myAccount/myPost?page=1&limit=${value.limit}&type=${typeInfo}`)
                    }}
                >
                {({isSubmitting}) => (
                  <Form>
                    <Flex justifyContent={"center"}>
                      <Field name="type1">
                          {({field}: any) => (<Checkbox {...field} key="1" value="1">일기</Checkbox>)}
                      </Field>
                      <Field name="type2">
                          {({field}: any) => (<Checkbox ml={4} {...field} key="1" value="2">독서록</Checkbox>)}
                      </Field>
                      <Field name="type3">
                          {({field}: any) => (<Checkbox ml={4} {...field} key="1" value="3">AI질문게시판</Checkbox>)}
                      </Field>
                      <Field name="limit">
                          {({field}: any) => (
                            <>
                            <Text ml={4} alignSelf={"center"}>페이지 당 개수</Text>
                            <Input type="number" ml={2} w={"55px"} h={"30px"} {...field} key="1" label="페이지 당 개수 (최대 30개)"/>
                            </>
                          )}
                      </Field>
                    </Flex>
                    <Box mt={4}>
                      <Button type="submit">검색</Button>
                    </Box>
                  </Form>
                )}
                </Formik>
              </Box>
            )}
          </Box>
          {!data && fetching ? (<div>loading...</div>) : (
              <Stack spacing={8}>
                {data?.offsetBasePosts.map((p) => !p ? null : (
                  <Box key={p.id} p={5} shadow="md" borderwidth="1px">
                    <Flex>
                      <Box flex={1}>
                        <NextLink href="/post/post_details/[id]" as={`/post/post_details/${p.id}`}>
                          <Link>
                            <Heading fontSize="xl">{p.title}</Heading>
                          </Link>
                        </NextLink>
                        <Flex>
                        <Text>작성자: {p.user.userName}</Text>
                        <Box ml="auto">
                          <EditDeleteButton post={p} />
                        </Box>
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Stack>
          )}
          <Box m={12} justifyContent={"center"}>
            <PageButtons limit={limit} type={type} />
          </Box>
        </MyAccountLayout>
    );
}

export default withUrqlClient(createUrqlClient)(myPost);