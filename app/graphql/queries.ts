import { gql } from '@apollo/client/core'

export const GET_ALL_FEEDBACKS = gql`
  query GetAllFeedbacks {
    feedbacks {
      id
      author
      content
      rating
      event {
        id
        name
      }
    }
  }
`

export const ADD_FEEDBACK = gql`
  mutation AddF($feedback: AddFeedbackInput!) {
    addFeedback(feedback: $feedback) {
      id
      author
      content
      rating
      event {
        id
        name
      }
    }
  }
`

export const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    events {
      id
      name
    }
  }
`

export const GET_EVENT = gql`
  query GetEventFeedbacks($id: ID!) {
    event(id: $id) {
      feedbacks {
        id
        author
        rating
        content
        event {
          id
          name
        }
      }
    }
  }
`

export const LISTEN_FOR_FEEDBACKS = gql`
  subscription OnFeedbackAdded {
    feedbackPosted {
      id
      author
      rating
      content
      event {
        id
        name
      }
    }
  }
`

export const FEEDBACKS_FOR_EVENT = gql`
  query FeedbackForEvent($id: ID) {
    feedbacksForEvent(id: $id) {
      id
      author
      rating
      content
      event {
        id
        name
      }
    }
  }
`
