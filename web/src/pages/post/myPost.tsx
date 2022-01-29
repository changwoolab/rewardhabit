import { Box, Button, Center, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { useOffsetBasePostsQuery, usePagesCountQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from "next/link"
import { PageButtons } from '../../components/pageButtons';
import { EditDeleteButton } from '../../components/CEDButton';
import { CommentButton } from '../../components/CommentButton';
import { UpdootSection } from '../../components/UpdootSection';


interface myPostProps {}

const myPost: React.FC<myPostProps> = ({}) => {
    const router = useRouter();
    let page = Number(router.query.page);
    let limit = Number(router.query.limit);
    let type = Number(router.query.type);
    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!type) type = 3;
    const [{data, fetching}] = useOffsetBasePostsQuery({variables: { type, limit, page }});

    console.log("posts:", data);

    return (
        <Layout variant="regular" height="100%">
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
          <Box mb={12} textAlign={"center"}>
            <PageButtons limit={limit} type={type} />
          </Box>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(myPost);