/* eslint-disable */
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

export type AddFeedbackInput = {
  author: Scalars['String']['input'];
  content: Scalars['String']['input'];
  event_id: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
  timestamp: Scalars['Int']['input'];
};

export type Event = {
  __typename?: 'Event';
  feedbacks?: Maybe<Array<Feedback>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Feedback = {
  __typename?: 'Feedback';
  author: Scalars['String']['output'];
  content: Scalars['String']['output'];
  event: Event;
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  timestamp: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFeedback?: Maybe<Feedback>;
  deleteFeedback?: Maybe<Array<Feedback>>;
};


export type MutationAddFeedbackArgs = {
  feedback: AddFeedbackInput;
};


export type MutationDeleteFeedbackArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Query = {
  __typename?: 'Query';
  event?: Maybe<Event>;
  events?: Maybe<Array<Maybe<Event>>>;
  feedbacks?: Maybe<Array<Maybe<Feedback>>>;
  feedbacksForEvent?: Maybe<Array<Maybe<Feedback>>>;
};


export type QueryEventArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryFeedbacksForEventArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  feedbackPosted?: Maybe<Feedback>;
};
