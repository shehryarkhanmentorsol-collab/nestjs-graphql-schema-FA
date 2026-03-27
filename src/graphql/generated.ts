import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type GQL_Author = {
  readonly __typename?: 'Author';
  readonly _id: Scalars['ID']['output'];
  readonly bio: Maybe<Scalars['String']['output']>;
  readonly books: Maybe<ReadonlyArray<Maybe<GQL_Book>>>;
  readonly createdAt: Maybe<Scalars['String']['output']>;
  readonly name: Scalars['String']['output'];
  readonly updatedAt: Maybe<Scalars['String']['output']>;
};

export type GQL_Book = {
  readonly __typename?: 'Book';
  readonly _id: Scalars['ID']['output'];
  readonly author: Maybe<GQL_Author>;
  readonly authorId: Scalars['ID']['output'];
  readonly createdAt: Maybe<Scalars['String']['output']>;
  readonly genre: Scalars['String']['output'];
  readonly publishedYear: Scalars['Int']['output'];
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Maybe<Scalars['String']['output']>;
};

export type GQL_Mutation = {
  readonly __typename?: 'Mutation';
  readonly _root: Maybe<Scalars['String']['output']>;
};

export type GQL_Query = {
  readonly __typename?: 'Query';
  readonly _root: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type GQL_ResolversTypes = {
  Author: ResolverTypeWrapper<GQL_Author>;
  Book: ResolverTypeWrapper<GQL_Book>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GQL_ResolversParentTypes = {
  Author: GQL_Author;
  Book: GQL_Book;
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
};

export type GQL_AuthorResolvers<ContextType = any, ParentType extends GQL_ResolversParentTypes['Author'] = GQL_ResolversParentTypes['Author']> = {
  _id: Resolver<GQL_ResolversTypes['ID'], ParentType, ContextType>;
  bio: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  books: Resolver<Maybe<ReadonlyArray<Maybe<GQL_ResolversTypes['Book']>>>, ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
};

export type GQL_BookResolvers<ContextType = any, ParentType extends GQL_ResolversParentTypes['Book'] = GQL_ResolversParentTypes['Book']> = {
  _id: Resolver<GQL_ResolversTypes['ID'], ParentType, ContextType>;
  author: Resolver<Maybe<GQL_ResolversTypes['Author']>, ParentType, ContextType>;
  authorId: Resolver<GQL_ResolversTypes['ID'], ParentType, ContextType>;
  createdAt: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  genre: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  publishedYear: Resolver<GQL_ResolversTypes['Int'], ParentType, ContextType>;
  title: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
};

export type GQL_MutationResolvers<ContextType = any, ParentType extends GQL_ResolversParentTypes['Mutation'] = GQL_ResolversParentTypes['Mutation']> = {
  _root: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
};

export type GQL_QueryResolvers<ContextType = any, ParentType extends GQL_ResolversParentTypes['Query'] = GQL_ResolversParentTypes['Query']> = {
  _root: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
};

export type GQL_Resolvers<ContextType = any> = {
  Author: GQL_AuthorResolvers<ContextType>;
  Book: GQL_BookResolvers<ContextType>;
  Mutation: GQL_MutationResolvers<ContextType>;
  Query: GQL_QueryResolvers<ContextType>;
};

