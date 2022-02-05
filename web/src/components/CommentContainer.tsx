import React from 'react';
import { Box, Flex, Image } from "@chakra-ui/react"
import { CommentFragFragment } from '../generated/graphql';

interface CommentContainerProps {
    imgSrc: string;
    comment: CommentFragFragment[]  | null | undefined;
}

export const CommentContainer: React.FC<CommentContainerProps> = ({imgSrc, comment}) => {
    let comments = [];
    if (!comment) {
        return null;
    }
    for(let i = 0; i < comment?.length; i++) {
        comments.push(
          <Flex key={i}>
            <Image
              mr={4}
              src={imgSrc}
              borderRadius="full"
              width={43}
              height={43}
            />
            <Box>
              {comment[i].userName}
              <Box>{comment[i].texts}</Box>
            </Box>
          </Flex>
        );
    }
    return ( 
        <>
          {comments}
        </> 
    )
}
