import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import type { Event, Feedback } from '~/graphql/__generated__/graphql'
import { GET_ALL_EVENTS, GET_EVENT_FEEDBACKS } from '~/graphql/queries'

const performQueries = async (
  client: ApolloClient<NormalizedCacheObject>,
  caching: boolean,
  variables: Record<string, any> | undefined
): Promise<{ events: Event[]; feedbacksForEvent: Feedback[] }> => {
  const [eventsData, feedbacksData] = await Promise.all([
    client.query({
      query: GET_ALL_EVENTS,
      fetchPolicy: caching ? 'cache-first' : 'no-cache',
    }),
    client.query({
      query: GET_EVENT_FEEDBACKS,
      fetchPolicy: caching ? 'cache-first' : 'no-cache',
      variables: variables || undefined,
    }),
  ])

  const {
    data: { events },
  } = eventsData
  const {
    data: { feedbacksForEvent },
  } = feedbacksData

  return { events, feedbacksForEvent }
}

export default performQueries
