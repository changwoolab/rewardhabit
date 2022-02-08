import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Float'];
  postId: Scalars['Float'];
  texts: Scalars['String'];
  userId: Scalars['Float'];
  userName: Scalars['String'];
  writtenDate: Scalars['DateTime'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Habit = {
  __typename?: 'Habit';
  allDay: Scalars['Boolean'];
  bgColor: Scalars['String'];
  checked: Scalars['Boolean'];
  habitDay: Scalars['String'];
  habitEnd: Scalars['String'];
  habitName: Scalars['String'];
  habitStart: Scalars['String'];
  id: Scalars['Float'];
  userId: Scalars['Float'];
};

export type HabitInput = {
  allDay: Scalars['Boolean'];
  bgColor: Scalars['String'];
  habitDay: Scalars['String'];
  habitEnd: Scalars['String'];
  habitName: Scalars['String'];
  habitStart: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  checkImmediateDuplicate: Scalars['Boolean'];
  createComment?: Maybe<Post>;
  createHabit: Habit;
  createPost: Post;
  deleteHabit: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  editHabit: Habit;
  forgotPassword: Scalars['Boolean'];
  forgotUserId: Scalars['Boolean'];
  login?: Maybe<UserResponse>;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updatePost?: Maybe<Post>;
  vote: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCheckImmediateDuplicateArgs = {
  input: Scalars['String'];
  mode: Scalars['String'];
};


export type MutationCreateCommentArgs = {
  postId: Scalars['Int'];
  texts: Scalars['String'];
};


export type MutationCreateHabitArgs = {
  habitInput: HabitInput;
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeleteHabitArgs = {
  habitId: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationEditHabitArgs = {
  habitId: Scalars['Int'];
  habitInput: HabitInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationForgotUserIdArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationRegisterArgs = {
  inputs: UserRegisterInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  texts: Scalars['String'];
  title: Scalars['String'];
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type PartialUser = {
  __typename?: 'PartialUser';
  exp: Scalars['Float'];
  id: Scalars['Float'];
  level: Scalars['Float'];
  point: Scalars['Float'];
  userId: Scalars['String'];
  userName: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  commentCount: Scalars['Float'];
  comments?: Maybe<Array<Comment>>;
  id: Scalars['Float'];
  likes: Scalars['Float'];
  texts: Scalars['String'];
  textsSnippet: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['Float'];
  updateDate: Scalars['DateTime'];
  updoots: Array<Updoot>;
  user: User;
  userId: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
  writtenDate: Scalars['DateTime'];
};

export type PostInput = {
  texts: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<UserResponse>;
  myAccount: UserResponse;
  myHabit: Habit;
  myHabits: Array<Habit>;
  offsetBasePosts: Array<Post>;
  pagesCount: Scalars['Int'];
  post: Post;
  posts: PaginatedPosts;
  test: Scalars['Boolean'];
};


export type QueryMyHabitArgs = {
  habitId: Scalars['Float'];
};


export type QueryOffsetBasePostsArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
  type: Scalars['Int'];
};


export type QueryPagesCountArgs = {
  limit: Scalars['Int'];
  type: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['DateTime']>;
  limit: Scalars['Int'];
};

export type Subscript = {
  __typename?: 'Subscript';
  daysRemain: Scalars['Float'];
  expireAt: Scalars['DateTime'];
  id: Scalars['Float'];
  reward: Scalars['Float'];
  rewardCount: Scalars['Float'];
  startedAt: Scalars['DateTime'];
  totalPayment: Scalars['Float'];
  type: Scalars['Float'];
  userId: Scalars['Float'];
};

export type Updoot = {
  __typename?: 'Updoot';
  post: Post;
  postId: Scalars['Float'];
  user: User;
  userId: Scalars['Float'];
  value: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  account: Scalars['String'];
  bank: Scalars['String'];
  email: Scalars['String'];
  exp: Scalars['Float'];
  firstName: Scalars['String'];
  id: Scalars['Float'];
  lastName: Scalars['String'];
  level: Scalars['Float'];
  point: Scalars['Float'];
  registerDate: Scalars['DateTime'];
  subscripts?: Maybe<Subscript>;
  userId: Scalars['String'];
  userName: Scalars['String'];
};

export type UserRegisterInput = {
  account: Scalars['String'];
  bank: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  userId: Scalars['String'];
  userName: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  partialUser?: Maybe<PartialUser>;
  user?: Maybe<User>;
};

export type CommentFragFragment = { __typename?: 'Comment', id: number, userName: string, texts: string, writtenDate: any };

export type ErrorsFragFragment = { __typename?: 'FieldError', field: string, message: string };

export type PostFragFragment = { __typename?: 'Post', id: number, userId: number, writtenDate: any, updateDate: any, type: number, likes: number, title: string, voteStatus?: number | null | undefined, user: { __typename?: 'User', id: number, userName: string, level: number }, comments?: Array<{ __typename?: 'Comment', id: number, userName: string, texts: string, writtenDate: any }> | null | undefined };

export type HabitFragFragment = { __typename?: 'Habit', id: number, allDay: boolean, habitName: string, habitDay: string, habitStart: string, habitEnd: string, checked: boolean, bgColor: string };

export type PartialUserFragFragment = { __typename?: 'PartialUser', id: number, userId: string, userName: string, point: number, level: number, exp: number };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type CreateHabitMutationVariables = Exact<{
  habitInput: HabitInput;
}>;


export type CreateHabitMutation = { __typename?: 'Mutation', createHabit: { __typename?: 'Habit', id: number, allDay: boolean, habitName: string, habitDay: string, habitStart: string, habitEnd: string, checked: boolean, bgColor: string } };

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, userId: number, writtenDate: any, type: number, title: string, texts: string } };

export type DeleteHabitMutationVariables = Exact<{
  habitId: Scalars['Int'];
}>;


export type DeleteHabitMutation = { __typename?: 'Mutation', deleteHabit: boolean };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type EditHabitMutationVariables = Exact<{
  habitId: Scalars['Int'];
  habitInput: HabitInput;
}>;


export type EditHabitMutation = { __typename?: 'Mutation', editHabit: { __typename?: 'Habit', id: number, allDay: boolean, habitName: string, habitDay: string, habitStart: string, habitEnd: string, checked: boolean, bgColor: string } };

export type ForgotPasswordMutationVariables = Exact<{
  userId: Scalars['String'];
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type ForgotUserIdMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotUserIdMutation = { __typename?: 'Mutation', forgotUserId: boolean };

export type LoginMutationVariables = Exact<{
  userId: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'UserResponse', partialUser?: { __typename?: 'PartialUser', id: number, userId: string, userName: string, point: number, level: number, exp: number } | null | undefined } | null | undefined };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  inputs: UserRegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, partialUser?: { __typename?: 'PartialUser', id: number, userId: string, userName: string, point: number, level: number, exp: number } | null | undefined } };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  texts: Scalars['String'];
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'Post', id: number, userId: number, writtenDate: any, updateDate: any, type: number, likes: number, title: string, texts: string } | null | undefined };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type MySubscriptQueryVariables = Exact<{ [key: string]: never; }>;


export type MySubscriptQuery = { __typename?: 'Query', myAccount: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, lastName: string, firstName: string, subscripts?: { __typename?: 'Subscript', id: number, userId: number, type: number, startedAt: any, expireAt: any, reward: number, rewardCount: number, totalPayment: number, daysRemain: number } | null | undefined } | null | undefined } };

export type CheckImmediateDuplicateMutationVariables = Exact<{
  mode: Scalars['String'];
  input: Scalars['String'];
}>;


export type CheckImmediateDuplicateMutation = { __typename?: 'Mutation', checkImmediateDuplicate: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'UserResponse', partialUser?: { __typename?: 'PartialUser', id: number, userId: string, userName: string, point: number, level: number, exp: number } | null | undefined } | null | undefined };

export type MyAccountQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAccountQuery = { __typename?: 'Query', myAccount: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, userId: string, lastName: string, firstName: string, email: string, userName: string, bank: string, account: string } | null | undefined } };

export type MyHabitQueryVariables = Exact<{
  habitId: Scalars['Float'];
}>;


export type MyHabitQuery = { __typename?: 'Query', myHabit: { __typename?: 'Habit', id: number, allDay: boolean, habitName: string, habitDay: string, habitStart: string, habitEnd: string, checked: boolean, bgColor: string } };

export type MyHabitsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyHabitsQuery = { __typename?: 'Query', myHabits: Array<{ __typename?: 'Habit', id: number, allDay: boolean, habitName: string, habitDay: string, habitStart: string, habitEnd: string, checked: boolean, bgColor: string }> };

export type OffsetBasePostsQueryVariables = Exact<{
  type: Scalars['Int'];
  limit: Scalars['Int'];
  page: Scalars['Int'];
}>;


export type OffsetBasePostsQuery = { __typename?: 'Query', offsetBasePosts: Array<{ __typename?: 'Post', textsSnippet: string, id: number, userId: number, writtenDate: any, updateDate: any, type: number, likes: number, title: string, voteStatus?: number | null | undefined, user: { __typename?: 'User', id: number, userName: string, level: number }, comments?: Array<{ __typename?: 'Comment', id: number, userName: string, texts: string, writtenDate: any }> | null | undefined }> };

export type PagesCountQueryVariables = Exact<{
  type: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type PagesCountQuery = { __typename?: 'Query', pagesCount: number };

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = { __typename?: 'Query', post: { __typename?: 'Post', texts: string, id: number, userId: number, writtenDate: any, updateDate: any, type: number, likes: number, title: string, voteStatus?: number | null | undefined, user: { __typename?: 'User', id: number, userName: string, level: number }, comments?: Array<{ __typename?: 'Comment', id: number, userName: string, texts: string, writtenDate: any }> | null | undefined } };

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['DateTime']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, posts: Array<{ __typename?: 'Post', textsSnippet: string, id: number, userId: number, writtenDate: any, updateDate: any, type: number, likes: number, title: string, voteStatus?: number | null | undefined, user: { __typename?: 'User', id: number, userName: string, level: number }, comments?: Array<{ __typename?: 'Comment', id: number, userName: string, texts: string, writtenDate: any }> | null | undefined }> } };

export const ErrorsFragFragmentDoc = gql`
    fragment ErrorsFrag on FieldError {
  field
  message
}
    `;
export const CommentFragFragmentDoc = gql`
    fragment CommentFrag on Comment {
  id
  userName
  texts
  writtenDate
}
    `;
export const PostFragFragmentDoc = gql`
    fragment PostFrag on Post {
  id
  userId
  writtenDate
  updateDate
  type
  likes
  title
  voteStatus
  user {
    id
    userName
    level
  }
  comments {
    ...CommentFrag
  }
}
    ${CommentFragFragmentDoc}`;
export const HabitFragFragmentDoc = gql`
    fragment habitFrag on Habit {
  id
  allDay
  habitName
  habitDay
  habitStart
  habitEnd
  checked
  bgColor
}
    `;
export const PartialUserFragFragmentDoc = gql`
    fragment PartialUserFrag on PartialUser {
  id
  userId
  userName
  point
  level
  exp
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword)
}
    `;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateHabitDocument = gql`
    mutation CreateHabit($habitInput: HabitInput!) {
  createHabit(habitInput: $habitInput) {
    ...habitFrag
  }
}
    ${HabitFragFragmentDoc}`;

export function useCreateHabitMutation() {
  return Urql.useMutation<CreateHabitMutation, CreateHabitMutationVariables>(CreateHabitDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    userId
    writtenDate
    type
    title
    texts
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeleteHabitDocument = gql`
    mutation DeleteHabit($habitId: Int!) {
  deleteHabit(habitId: $habitId)
}
    `;

export function useDeleteHabitMutation() {
  return Urql.useMutation<DeleteHabitMutation, DeleteHabitMutationVariables>(DeleteHabitDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const EditHabitDocument = gql`
    mutation EditHabit($habitId: Int!, $habitInput: HabitInput!) {
  editHabit(habitId: $habitId, habitInput: $habitInput) {
    ...habitFrag
  }
}
    ${HabitFragFragmentDoc}`;

export function useEditHabitMutation() {
  return Urql.useMutation<EditHabitMutation, EditHabitMutationVariables>(EditHabitDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($userId: String!, $email: String!) {
  forgotPassword(userId: $userId, email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const ForgotUserIdDocument = gql`
    mutation ForgotUserId($email: String!) {
  forgotUserId(email: $email)
}
    `;

export function useForgotUserIdMutation() {
  return Urql.useMutation<ForgotUserIdMutation, ForgotUserIdMutationVariables>(ForgotUserIdDocument);
};
export const LoginDocument = gql`
    mutation Login($userId: String!, $password: String!) {
  login(userId: $userId, password: $password) {
    partialUser {
      ...PartialUserFrag
    }
  }
}
    ${PartialUserFragFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($inputs: UserRegisterInput!) {
  register(inputs: $inputs) {
    errors {
      ...ErrorsFrag
    }
    partialUser {
      ...PartialUserFrag
    }
  }
}
    ${ErrorsFragFragmentDoc}
${PartialUserFragFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $texts: String!) {
  updatePost(id: $id, title: $title, texts: $texts) {
    id
    userId
    writtenDate
    updateDate
    type
    likes
    title
    texts
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const MySubscriptDocument = gql`
    query MySubscript {
  myAccount {
    user {
      id
      lastName
      firstName
      subscripts {
        id
        userId
        type
        startedAt
        expireAt
        reward
        rewardCount
        totalPayment
        daysRemain
      }
    }
  }
}
    `;

export function useMySubscriptQuery(options: Omit<Urql.UseQueryArgs<MySubscriptQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MySubscriptQuery>({ query: MySubscriptDocument, ...options });
};
export const CheckImmediateDuplicateDocument = gql`
    mutation CheckImmediateDuplicate($mode: String!, $input: String!) {
  checkImmediateDuplicate(mode: $mode, input: $input)
}
    `;

export function useCheckImmediateDuplicateMutation() {
  return Urql.useMutation<CheckImmediateDuplicateMutation, CheckImmediateDuplicateMutationVariables>(CheckImmediateDuplicateDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    partialUser {
      ...PartialUserFrag
    }
  }
}
    ${PartialUserFragFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MyAccountDocument = gql`
    query MyAccount {
  myAccount {
    user {
      id
      userId
      lastName
      firstName
      email
      userName
      bank
      account
    }
  }
}
    `;

export function useMyAccountQuery(options: Omit<Urql.UseQueryArgs<MyAccountQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyAccountQuery>({ query: MyAccountDocument, ...options });
};
export const MyHabitDocument = gql`
    query MyHabit($habitId: Float!) {
  myHabit(habitId: $habitId) {
    ...habitFrag
  }
}
    ${HabitFragFragmentDoc}`;

export function useMyHabitQuery(options: Omit<Urql.UseQueryArgs<MyHabitQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyHabitQuery>({ query: MyHabitDocument, ...options });
};
export const MyHabitsDocument = gql`
    query MyHabits {
  myHabits {
    ...habitFrag
  }
}
    ${HabitFragFragmentDoc}`;

export function useMyHabitsQuery(options: Omit<Urql.UseQueryArgs<MyHabitsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyHabitsQuery>({ query: MyHabitsDocument, ...options });
};
export const OffsetBasePostsDocument = gql`
    query OffsetBasePosts($type: Int!, $limit: Int!, $page: Int!) {
  offsetBasePosts(type: $type, limit: $limit, page: $page) {
    ...PostFrag
    textsSnippet
  }
}
    ${PostFragFragmentDoc}`;

export function useOffsetBasePostsQuery(options: Omit<Urql.UseQueryArgs<OffsetBasePostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<OffsetBasePostsQuery>({ query: OffsetBasePostsDocument, ...options });
};
export const PagesCountDocument = gql`
    query PagesCount($type: Int!, $limit: Int!) {
  pagesCount(type: $type, limit: $limit)
}
    `;

export function usePagesCountQuery(options: Omit<Urql.UseQueryArgs<PagesCountQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PagesCountQuery>({ query: PagesCountDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    ...PostFrag
    texts
  }
}
    ${PostFragFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: DateTime) {
  posts(limit: $limit, cursor: $cursor) {
    posts {
      ...PostFrag
      textsSnippet
    }
    hasMore
  }
}
    ${PostFragFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};