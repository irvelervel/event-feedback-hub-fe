import { ApolloClient } from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { split } from '@apollo/client/link/core'
import { HttpLink } from '@apollo/client/link/http'
import { getMainDefinition } from '@apollo/client/utilities'

// separates the links, the normal HTTP one will be used for CRUD operations
const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_BE_HTTP_URL}/graphql`,
})

// separates the links, the WS one will be used for listening to the subscription triggers
const wsLink = new GraphQLWsLink(
  createClient({
    url: `${import.meta.env.VITE_BE_WS_URL}/graphql`,
  })
)

// joins them using the split function from @apollo/client
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

// creates the ApolloClient for the whole app
const createApolloClient = () => {
  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  })
}

export default createApolloClient
