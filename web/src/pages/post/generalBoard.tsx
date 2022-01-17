import { Center, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { Layout } from '../../components/Layout';
import { usePostsQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface myPostProps {}

const generalBoard: React.FC<myPostProps> = ({}) => {
    const [{data}] = usePostsQuery({
        variables: {
            limit: 10
        }
    });
    console.log(data);

    
    return (
        <Layout variant="regular">
          <Center>
            <Text>자유게시판</Text>
          </Center>
          {!data ? (<div>loading...</div>) : (
                data.posts.map((p) => <div key={p.id}>{p.title}</div>)
            )}
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(generalBoard);