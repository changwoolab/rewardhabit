import { Box, Button, Link } from '@chakra-ui/react';
import NextLink from "next/link"
import React from 'react';
import { usePagesCountQuery } from '../generated/graphql';

interface PageButtonsProps {
    type: number;
    limit: number;
}

export const PageButtons: React.FC<PageButtonsProps> = ({ type, limit }) => {
    const [pagesCount] = usePagesCountQuery({variables: { type, limit }});
    if (!pagesCount.data) {
        return null;
    }
    let body = [];
    for(let i = 1; i <= pagesCount.data?.pagesCount; i++) {
        body.push(
        <Box ml={4}>
          <NextLink  href={`/post/myPost?page=${i}&limit=${limit}&type=${type}`} as={`/post/myPost`}>
            <Button as={Link}>{i}</Button>
          </NextLink>
        </Box>
        );
    }
    return (
        <>
        {body}
        </>
    );
}