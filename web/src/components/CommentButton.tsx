import { ChatIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostFragFragment } from '../generated/graphql';
import { CommentContainer } from './CommentContainer';

interface CommentButtonProps {
    post: PostFragFragment
}

/** 댓글/수정/삭제 (Comment, Edit, Delete) 버튼 */
export const CommentButton: React.FC<CommentButtonProps> = ({post}) => {
    const [showComment, setShowComment] = useState<"show-comment" | "hide-comment">("hide-comment");

    if (!post.comments) return null;
    
    // 로그인 되어있지 않다면 수정/삭제 버튼 안보여줌
    return (
    <>
        <Flex>
        {showComment === "hide-comment" ? null : (
            <CommentContainer
            imgSrc="/open_ai_logo.jpg"
            comment={post.comments} />
        )}
            <IconButton ml={"auto"} aria-label="Edit Post" icon={<ChatIcon />} onClick={async () => {
            if (showComment === "hide-comment") {
                setShowComment("show-comment");
            } else {
                setShowComment("hide-comment");
            }
            }}/>
        </Flex>
    </>
      );
}