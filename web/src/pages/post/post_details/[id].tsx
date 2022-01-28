import { Box, Text, Flex, Heading, Image, Stack } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { EditDeleteButton } from '../../../components/CEDButton';
import { Layout } from '../../../components/Layout';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { CommentContainer } from '../../../components/CommentContainer';

const Post: React.FC = ({}) => {
    const [{data, error, fetching}] = useGetPostFromUrl();
    if (fetching) {
        return <div>loading...</div>
    }
    if (!data?.post) {
        return (
            <Layout variant='regular'height="120vh">
              <Box>요청하신 포스트는 존재하지 않습니다</Box>
            </Layout>
        )
    }
    return (
        <Layout variant='regular' height="120vh">
          <Flex flex={1}>
            <Heading mb={4}>{data.post.title}</Heading>
            <Box ml="auto">
              작성자: {data.post.user.userName}
             <EditDeleteButton post={data.post} />
            </Box>
          </Flex>


          <Stack spacing={8}>
            <Box p={5} shadow='md' borderWidth='1px'>
              <Text mt={4}>{data.post.texts}</Text>
            </Box>
              <CommentContainer
              imgSrc="/open_ai_logo.jpg"
              comment={data.post.comments} />
          </Stack>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);