import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Container } from '../components/Container';
import { InputField } from '../components/InputField';
import { Navbar } from '../components/Navbar';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();

    return (
        <>
    <Navbar/>
    <Container height="100vh">
    <Wrapper variant='regular'>
      <Formik initialValues={{ title: "", texts: "", type: 0}} onSubmit={async(values, {setErrors}) => {
          const res = await createPost({input: values});
          console.log(res);
          router.push("/");
        }}>
        {({ isSubmitting }) => (
         <Form>
            <InputField name="title" label="제목"/>
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