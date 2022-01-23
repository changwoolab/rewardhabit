import { Box, Text, Flex, Heading, Container, Stack } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { EditDeletePostButton } from '../../../components/EditDeletePostButton';
import { Layout } from '../../../components/Layout';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';

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
             <EditDeletePostButton post={data.post} />
            </Box>
          </Flex>


          <Stack spacing={8}>
            <Box p={5} shadow='md' borderWidth='1px'>
              <Text mt={4}>{data.post.texts}</Text>
            </Box>
            <Box>
              {data.post.comments ? data.post.comments[0].userName : null}
              <Box>
                {data.post.comments ? data.post.comments[0].texts : null}
              </Box>
            </Box>
          </Stack>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);