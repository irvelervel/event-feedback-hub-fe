import { ApolloClient } from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { split } from '@apollo/client/link/core'
import { HttpLink } from '@apollo/client/link/http'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_BE_HTTP_URL}/graphql`,
  // `${import.meta.env.VITE_BE_URL}/graphql`
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${import.meta.env.VITE_BE_WS_URL}/graphql`,
    // url: 'ws://localhost:4000/graphql',
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const createApolloClient = () => {
  return new ApolloClient({
    // uri: `${import.meta.env.VITE_BE_URL}/graphql`,
    link: splitLink,
    cache: new InMemoryCache(),
  })
}

export default createApolloClient
