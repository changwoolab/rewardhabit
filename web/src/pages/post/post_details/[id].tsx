import { Box, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../../components/Layout';
import { usePostQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';

const Post: React.FC = ({}) => {
    const router = useRouter();
    const postId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    const [{data, error, fetching}] = usePostQuery({
        pause: postId === -1,
        variables: {
            id: postId
        }
    })
    if (fetching) {
        return <div>loading...</div>
    }
    if (!data?.post) {
        return (
            <Layout variant='regular'height="120vh">
              <Box>그런 포스트는 존재하지 않습니다.</Box>
            </Layout>
        )
    }
    return (
        <Layout variant='regular' height="120vh">
          <Heading mb={4}>{data?.post?.title}</Heading>
          {data?.post?.texts}
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);