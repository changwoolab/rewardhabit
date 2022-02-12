import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { Button } from '@chakra-ui/react';
import { tossPayment } from '../../utils/tossPayment';

interface testProps {}

const test: React.FC<testProps> = ({}) => {
    return (
        <>
        <Button onClick={() => {
            tossPayment()
        }}>asdf</Button>
        </>
    );
}

export default withUrqlClient(createUrqlClient)(test);