import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`, // Use same base URL as RTK Query
  credentials: 'include', // Include credentials like RTK Query
})

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('access_token')
  
  console.log('Apollo Client - Token from localStorage:', token)
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // Make sure to use 'Authorization' (capital A) to match RTK Query exactly
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`)
    })
  }
  if (networkError) {
    console.error(`Network error: ${networkError}`)
    // If it's a 401 error, redirect to login
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
  }
})

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})
