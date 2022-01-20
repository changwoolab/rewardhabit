import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostFragFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostFragFragment;
}

/** Likes 표시 및 변경 */
export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    // 그냥 useState 연습용
    const [loadingState, setLoadingState] = useState<"updoot-loading" | "downdoot-loading" | "not-loading">("not-loading");
    const [, vote] = useVoteMutation();

    return (
      <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
        <IconButton aria-label='updoot post' icon={<ChevronUpIcon/>} 
            isLoading={loadingState === "updoot-loading"} 
            onClick={async () => {
                // 이미 투표했다면, 아무것도 안하기
                if (post.voteStatus === 1) {
                    return;
                }
                setLoadingState("updoot-loading");
                await vote({
                    postId: post.id,
                    value: 1,
                })
                setLoadingState("not-loading");
            }}
            colorScheme={post.voteStatus === 1 ? "green" : undefined}
            />
          {post.likes}
        <IconButton aria-label='downdoot post' icon={<ChevronDownIcon/>} 
            isLoading={loadingState === "downdoot-loading"}
            onClick={async () => {
                if (post.voteStatus === -1) {
                    return;
                }
                setLoadingState("downdoot-loading");
                await vote({
                    postId: post.id,
                    value: -1,
                })
                setLoadingState("not-loading");
            }}
            colorScheme={post.voteStatus === -1 ? "red" : undefined}
            />
      </Flex>
    );
}
