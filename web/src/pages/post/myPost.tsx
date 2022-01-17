import { Center, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface myPostProps {}

const myPost: React.FC<myPostProps> = ({}) => {
    let body: any = null;
    
    return (
        <Layout variant="regular">
          <Center>
            <Text>내가 쓴 글</Text>
            {body}
          </Center>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(myPost);