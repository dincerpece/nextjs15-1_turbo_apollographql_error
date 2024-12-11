'use client'
import { ApolloLink, HttpLink } from '@apollo/client'
import { ApolloNextAppProvider, InMemoryCache, SSRMultipartLink, ApolloClient } from '@apollo/experimental-nextjs-app-support'
import React from 'react'
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
import { createHash } from 'crypto'

const sha256 = async (data: string) => {
  return createHash('sha256').update(data).digest('hex')
}

const linkChain = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: false,
}).concat(new HttpLink({ uri: 'http://localhost:65000/api/na/gql' }))

function makeClient() {
  return new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache({ addTypename: false }),
    credentials: 'include',
    link: typeof window === 'undefined'
        ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: false,
          }),
          linkChain,
        ])
        :linkChain,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'none',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'none',
      },
      mutate: {
        errorPolicy: 'none',
      },
    },
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
