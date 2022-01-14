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

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  checkImmediateDuplicate: Scalars['Boolean'];
  createPost: Post;
  forgotPassword: Scalars['Boolean'];
  forgotUserId: Scalars['Boolean'];
  login?: Maybe<UserResponse>;
  logout: Scalars['Boolean'];
  register: UserResponse;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCheckImmediateDuplicateArgs = {
  input: Scalars['String'];
  mode: Scalars['String'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
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
  id: Scalars['Float'];
  texts: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['Float'];
  userId: Scalars['Float'];
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
  post: Post;
  posts: Array<Post>;
  test: Scalars['Boolean'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
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
};

export type ErrorsFragFragment = { __typename?: 'FieldError', field: string, message: string };

export type PartialUserFragFragment = { __typename?: 'PartialUser', id: number, userId: string, userName: string, point: number, level: number, exp: number };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, userId: number, writtenDate: any, type: number, title: string, texts: string } };

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

export type CheckImmediateDuplicateMutationVariables = Exact<{
  mode: Scalars['String'];
  input: Scalars['String'];
}>;


export type CheckImmediateDuplicateMutation = { __typename?: 'Mutation', checkImmediateDuplicate: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'UserResponse', partialUser?: { __typename?: 'PartialUser', id: number, userId: string, userName: string, point: number, level: number, exp: number } | null | undefined } | null | undefined };

export const ErrorsFragFragmentDoc = gql`
    fragment ErrorsFrag on FieldError {
  field
  message
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