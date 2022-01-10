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
  checkImmediateDuplicate: Scalars['Boolean'];
  createPost: Scalars['Boolean'];
  login: Scalars['Boolean'];
  register: UserResponse;
};


export type MutationCheckImmediateDuplicateArgs = {
  input: Scalars['String'];
  mode: Scalars['String'];
};


export type MutationCreatePostArgs = {
  description: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['Float'];
  userId: Scalars['String'];
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
  description: Scalars['String'];
  id: Scalars['Float'];
  title: Scalars['String'];
  type: Scalars['Float'];
  writtenDate: Scalars['DateTime'];
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
  succeed?: Maybe<Scalars['Boolean']>;
  user?: Maybe<User>;
};

export type LoginMutationVariables = Exact<{
  userId: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: boolean };

export type RegisterMutationVariables = Exact<{
  userId: Scalars['String'];
  password: Scalars['String'];
  lastName: Scalars['String'];
  firstName: Scalars['String'];
  email: Scalars['String'];
  userName: Scalars['String'];
  bank: Scalars['String'];
  account: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', succeed?: boolean | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, partialUser?: { __typename?: 'PartialUser', id: number, userId: string, userName: string, point: number, level: number, exp: number } | null | undefined } };

export type CheckImmediateDuplicateMutationVariables = Exact<{
  mode: Scalars['String'];
  input: Scalars['String'];
}>;


export type CheckImmediateDuplicateMutation = { __typename?: 'Mutation', checkImmediateDuplicate: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'UserResponse', partialUser?: { __typename?: 'PartialUser', id: number, userId: string, userName: string, point: number, level: number, exp: number } | null | undefined } | null | undefined };


export const LoginDocument = gql`
    mutation Login($userId: String!, $password: String!) {
  login(userId: $userId, password: $password)
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($userId: String!, $password: String!, $lastName: String!, $firstName: String!, $email: String!, $userName: String!, $bank: String!, $account: String!) {
  register(
    inputs: {userId: $userId, password: $password, lastName: $lastName, firstName: $firstName, email: $email, userName: $userName, bank: $bank, account: $account}
  ) {
    errors {
      field
      message
    }
    succeed
    partialUser {
      id
      userId
      userName
      point
      level
      exp
    }
  }
}
    `;

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
      id
      userId
      userName
      point
      level
      exp
    }
  }
}
    `;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};