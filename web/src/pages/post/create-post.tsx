import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { object, ref, string } from 'yup';
import { InputField } from '../../components/InputField';
import { Layout } from '../../components/Layout';
import { useCreatePostMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { selectOptions } from '../../utils/selectOptions';
import { useIsLogin } from '../../utils/useIsLogin';

// Yup validation Schema
const createPostValidation = object().shape({
  title: string().required("제목을 입력해주세요"),
  // 자유게시판이면 제한X, 독서/일기면 최소 40자 이상
  texts: string().required("내용을 입력해주세요")
  .test("texts", "독서록/일기는 최소 40자 이상 입력해주세요", (value, testContext) => {
    if (!value) return false;
    const type = testContext.parent.type;
    if (type != 3) {
      if (value.length < 40) {
        return false;
      }
    }
    return true;
  }),
  type: string().required("종류를 선택해주세요").min(1, "종류를 선택해주세요").max(3, "종류를 선택해주세요")
});

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();

    // 로그인 되어있는지 확인
    useIsLogin();

    return (
      <Layout variant="regular">
        <Formik initialValues={{ title: "", texts: "", type: 0}} 
          validationSchema={createPostValidation}
          onSubmit={async(values) => {
            // 타입 변경
            values.type = Number(values.type);
            const { error } = await createPost({input: values});
            if (!error) {
              if (values.type === 3) {
                router.push("/post/generalBoard")
              } else {
                // 나중에 "내 일기/독서록" 페이지 만들면 거기로 이동하게 만들기
                router.push("/");
              }
            }
          }}>
          {({ isSubmitting }) => (
          <Form>
              <InputField name="title" label="제목"/>
              <InputField name="type" label="종류" select selectOptions={selectOptions}/>
              <InputField name="texts" label="내용" textarea />
              <Box textAlign={"center"}>
                <Button mt={4} w={"100%"} colorScheme='teal' isLoading={isSubmitting} type='submit'> 발행 </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Layout>

    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);