import { ApolloClient } from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache'

const createApolloClient = () => {
  return new ApolloClient({
    uri: `${import.meta.env.VITE_BE_URL}/graphql`,
    cache: new InMemoryCache(),
  })
}

export default createApolloClient
