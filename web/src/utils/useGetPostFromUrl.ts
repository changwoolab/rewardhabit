import { usePostQuery } from "../generated/graphql";
import { getIdFromUrl } from "./getIdFromUrl";

export const useGetPostFromUrl = () => {
  const postId = getIdFromUrl();
  return usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId,
    },
  });
};
