import { Button, Center, Link, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Layout } from '../../../components/Layout';
import { useOffsetBasePostsQuery, usePagesCountQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import NextLink from "next/link"

interface myPostProps {}

const myPost: React.FC<myPostProps> = ({}) => {
    const router = useRouter();
    const page = Number(router.query.page);
    const limit = Number(router.query.limit);
    const type = Number(router.query.type);
    console.log("page, limit, type", page, limit, type);
    if(!page || !limit || !type) return <Layout variant="regular" height="120vh">로딩중...</Layout>
    const [pagesCount] = usePagesCountQuery({variables: { type, limit }});
    const [posts] = useOffsetBasePostsQuery({variables: { type, limit, page }});
    console.log("pages: ", pagesCount)
    console.log("posts:", posts);
    let body: any = null;
    
    return (
        <Layout variant="regular" height="120vh">
          <Center>
            <Text>내가 쓴 글</Text>
            {body}
          </Center>
          <NextLink href="/post/myPost/4">
            <Button as={Link} onClick={(value) => {console.log(value)}}>4</Button>
          </NextLink>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(myPost);