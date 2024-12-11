import { gql } from '@apollo/client'

export const UserGql = gql`
    query User {
        user {
            data {
                userName
               
            }
        }
    }
`
