import { gql } from '@apollo/client/core'

// query for getting the list of available events
export const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    events {
      id
      name
    }
  }
`

// query for getting the feedbacks specific to a single event, or all the feedbacks if $id is not provided
// (useful for the initial server-side loading, where all available feedbacks should be displayed)
export const GET_EVENT_FEEDBACKS = gql`
  query FeedbacksForEvent($rating: Int, $id: ID) {
    feedbacksForEvent(rating: $rating, id: $id) {
      id
      author
      rating
      content
      timestamp
      event {
        id
        name
      }
    }
  }
`

// mutation for adding a new feedback, through the sidebar form
export const ADD_FEEDBACK = gql`
  mutation AddFeedback($feedback: AddFeedbackInput!) {
    addFeedback(feedback: $feedback) {
      id
      author
      content
      rating
      timestamp
      event {
        id
        name
      }
    }
  }
`

// subscription for listening to incoming feedbacks. Data received is not really used in the app
// (filtered feedbacks are freshly refetched on arrival)
export const FEEDBACK_SUBSCRIPTION = gql`
  subscription OnFeedbackAdded {
    feedbackPosted {
      id
      author
      rating
      content
      timestamp
      event {
        id
        name
      }
    }
  }
`
