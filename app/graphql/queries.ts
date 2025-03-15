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

export const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    events {
      id
      name
    }
  }
`

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
    }
  }
`
