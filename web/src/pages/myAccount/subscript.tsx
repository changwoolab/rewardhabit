import { Box, Button, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { MyAccountLayout } from '../../components/myAccountLayout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from "next/link"

interface subscriptProps {}

const subscript: React.FC<subscriptProps> = ({}) => {
    return (
        <MyAccountLayout>
          <Box textAlign={"center"}>
            <Text>현재 구독중인 서비스</Text>
          </Box>
          <NextLink href="/payment/subscript">
            <Button>구독하기</Button>
          </NextLink>
        </MyAccountLayout>
    );
}

export default withUrqlClient(createUrqlClient)(subscript);