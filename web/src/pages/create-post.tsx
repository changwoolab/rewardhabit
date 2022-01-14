import { Box, Button, FormControl, Select } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { number, object, ref, string, ValidationError } from 'yup';
import { Container } from '../components/Container';
import { InputField } from '../components/InputField';
import { Navbar } from '../components/Navbar';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

// Yup validation Schema
const createPostValidation = object().shape({
  title: string().required("제목을 입력해주세요"),
  texts: string().required("내용을 입력해주세요").min(40, "최소 40자 이상 입력해주세요"),
  type: string().required("종류를 입력해주세요").min(1, "독서록/일기를 선택해주세요").max(2, "독서록/일기를 선택해주세요")
});

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();

    return (
        <>
    <Navbar/>
    <Container height="100vh">
    <Wrapper variant='regular'>
      <Formik initialValues={{ title: "", texts: "", type: 0}} 
        validationSchema={createPostValidation}
        onSubmit={async(values, {setErrors}) => {
          // 타입 변경
          values.type = Number(values.type);
          const res = await createPost({input: values});
          if (res.error) {
            alert(res.error.message);
          } else {
            router.push("/");
          }
        }}>
        {({ isSubmitting }) => (
         <Form>
            <InputField name="title" label="제목"/>
            <InputField name="type" label="종류" select selectOptions={[{ value: "1", option: "독서록"}, {value: "2", option: "일기"}]}/>
            <InputField name="texts" label="내용" textarea />
            <Box textAlign={"center"}>
              <Button mt={4} w={"100%"} colorScheme='teal' isLoading={isSubmitting} type='submit'> 발행 </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
    </Container>
    </>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);