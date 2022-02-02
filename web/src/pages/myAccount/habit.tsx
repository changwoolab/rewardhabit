import { withUrqlClient } from 'next-urql';
import React from 'react';
import { MyAccountLayout } from '../../components/myAccountLayout';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface habitProps {}

const habit: React.FC<habitProps> = ({}) => {
    return (
        <MyAccountLayout>
            
        </MyAccountLayout>
    );
}

export default withUrqlClient(createUrqlClient)(habit);