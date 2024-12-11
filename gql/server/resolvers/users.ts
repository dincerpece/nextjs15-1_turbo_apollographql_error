import { Context } from '@/src/app/api/na/gql/route'

const users = {
  Query: {
    user: async (parent: any, args: any, context: Context) => {

      return { data: {userName: 'NextJs - Apollographql'} }
  },
  },
}

export default users