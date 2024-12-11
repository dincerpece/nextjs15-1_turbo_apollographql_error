import { InMemoryCache, ApolloClient, registerApolloClient, SSRMultipartLink } from '@apollo/experimental-nextjs-app-support'
import { ApolloLink ,HttpLink} from '@apollo/client'
import {createHash} from "crypto";
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'

const sha256 = async (data: string) => {
  return createHash('sha256').update(data).digest('hex');
};

const linkChain = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: false,
}).concat(new HttpLink({ uri: 'http://localhost:65000/api/na/gql' }))

export const { getClient } = registerApolloClient(async () => {

  return new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache({ addTypename: false }),
    link: typeof window === 'undefined'
        ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: false,
          }),
          linkChain,
        ])
        : linkChain,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  })
})
