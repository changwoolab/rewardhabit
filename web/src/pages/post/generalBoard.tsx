import { Box, Button, Center, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { usePostsQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface myPostProps {}

/**
 일반게시판
 */
const generalBoard: React.FC<myPostProps> = ({}) => {
    const [variables, setVariables] = useState({ 
        limit: 10, cursor: null 
    });

    const [{data, fetching}] = usePostsQuery({
        variables,
    });

    if (!data && !fetching) {
        return <Center><div>서버에 오류가 발생했습니다. 잠시 후 다시 실행해주세요</div></Center>
    }
    
    return (
        <Layout variant="regular">
          <Center>
            <Text>자유게시판</Text>
          </Center>
          {!data && fetching ? (<div>loading...</div>) : (
              <Stack spacing={8}>
                {data!.posts.posts.map((p) => (
                  <Box key={p.id} p={5} shadow="md" borderwidth="1px">
                    <Heading fontSize="xl">{p.title}</Heading>
                    <Text>작성자: {p.user.userName}</Text>
                    <Text mt={4}>{p.textsSnippet}</Text>
                  </Box>
                ))}
              </Stack>
            )}
            {data && data.posts.hasMore ? (
                <Center mt={8} mb={8}>
                  <Button onClick={() => {
                      /* 버튼이 클릭될 때마다 State를 변환
                      limit은 그대로 10으로 유지, cursor는 가장 마지막으로 불러온 post의 writtendate가 되어야 함. */
                      setVariables({
                          limit: variables.limit,
                          cursor: data.posts.posts[data.posts.posts.length - 1].writtenDate,
                      });
                  }} isLoading={fetching}>
                    더 불러오기
                  </Button>
                </Center>
            ) : null}
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(generalBoard);