import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from "next/link";
import { PostFragFragment, useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeleteButtonProps {
    post: PostFragFragment
}

/** 수정/삭제 버튼 */
export const EditDeleteButton: React.FC<EditDeleteButtonProps> = ({ post }) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  // 로그인 되어있지 않다면 수정/삭제 버튼 안보여줌
  return meData?.me?.partialUser?.id !== post.userId ? null : (
    <>
      <Box>
        <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
          <IconButton
            as={Link}
            mr={1}
            aria-label="Edit Post"
            icon={<EditIcon />}
          />
        </NextLink>
        <IconButton
          aria-label="Delete Post"
          icon={<DeleteIcon />}
          onClick={async () => {
            const really = confirm("정말 삭제하시겠습니까?");
            if (!really) {
            } else {
              const res = await deletePost({ id: post.id });
              if (!res.data?.deletePost) {
                alert("오류가 발생했습니다");
              }
            }
          }}
        />
      </Box>
    </>
  );
};