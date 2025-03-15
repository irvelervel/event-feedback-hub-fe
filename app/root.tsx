import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import { ApolloClient } from '@apollo/client/core'

import { createHttpLink } from '@apollo/client/link/http'
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache'

// import { useQuery } from '@apollo/client/react/hooks'
// import type { Country } from '~/graphql/__generated_s_/graphql'
// import { GET_ALL_COUNTRIES } from '~/graphql/queries'

import type { Route } from './+types/root'
import './app.css'
// import { gql } from '@apollo/client/core'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

// const graphQLClient = new ApolloClient({
//   ssrMode: true, // Indicates that we want to use server side rendering
//   link: createHttpLink({
//     // Use createHttpLink instead of uri
//     uri: 'http://localhost:4000/graphql', //Path to GraphQL schema
//     // uri: 'https://countries.trevorblades.com/graphql', //Path to GraphQL schema
//     headers: {
//       'Access-Control-Allow-Origin': '*', //Cors management
//     },
//   }),
//   cache: new InMemoryCache(), // Cache management
// })

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export async function loader() {
  // const contacts = ['test']
  // return { contacts }
  // const { loading, error, data } = useQuery(GET_ALL_COUNTRIES)
  // return { loading, error, data }
  // Initialize Apollo client
  // const graphQLClient = new ApolloClient({
  //   ssrMode: true, // Indicates that we want to use server side rendering
  //   link: createHttpLink({
  //     // Use createHttpLink instead of uri
  //     uri: 'http://localhost:4000/graphql', //Path to GraphQL schema
  //     // uri: 'https://countries.trevorblades.com/graphql', //Path to GraphQL schema
  //     headers: {
  //       'Access-Control-Allow-Origin': '*', //Cors management
  //     },
  //   }),
  //   cache: new InMemoryCache(), // Cache management
  // })
  // const boh = await graphQLClient.query({
  //   query: gql`
  //     query GetAllCountries {
  //       feedbacks {
  //         id
  //         author
  //       }
  //     }
  //   `,
  // })
  // console.log('??', boh)
  // return boh
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
