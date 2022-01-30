import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { getIdFromUrl } from '../../../utils/getIdFromUrl';
import { writePostValidation } from '../../../utils/writePostValidation';

const EditPost: React.FC = ({}) => {
    const router = useRouter();
    const postId = getIdFromUrl();
    const [{data, fetching}] = usePostQuery({
        pause: postId === -1,
        variables: {
            id: postId
        }
    });
    const [,updatePost] = useUpdatePostMutation();
    if (fetching) {
        return (
            <Layout variant="regular">
                <div>loading...</div>
            </Layout>
        )
    }
    if (!data?.post) {
        return (
            <Layout variant='regular'>
              <Box>요청하신 포스트는 존재하지 않습니다</Box>
            </Layout>
        );
    }
    return (
        <Layout variant="regular">
        <Formik initialValues={{ title: data.post.title, texts: data.post.texts, type: data.post.type}} 
          validationSchema={writePostValidation}
          onSubmit={async(values) => {
              const res = await updatePost({ id: postId, title: values.title, texts: values.texts });
              if (!res) {
                  alert("오류가 발생했습니다")
              } else {
                router.push(`/post/post_details/${postId}`);
              }
          }}>
          {({ isSubmitting }) => (
          <Form>
              <InputField name="title" label="제목"/>
              <InputField name="type" label="종류 (종류는 변경하실 수 없습니다)" readOnly/>
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

export default withUrqlClient(createUrqlClient)(EditPost);