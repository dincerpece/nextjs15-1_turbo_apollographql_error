import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { NextApiRequest, NextApiResponse } from 'next'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import resolvers from '@/gql/server/resolvers'
import typeDefs from '@/gql/server/schemas'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
const app = express()
const httpServer = http.createServer(app)
import express from 'express'
import http from 'http'

export type Context = {
  res: NextApiResponse
  req: NextApiRequest
}

const apolloServer = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageProductionDefault({}) : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
})

const handleRequest = startServerAndCreateNextHandler(apolloServer, {
  context: async (req: NextApiRequest, res: NextApiResponse) => {
    return {
      req,
      res,
    }
  },
})
export { handleRequest as GET, handleRequest as POST }
