import { gql } from '@apollo/client'

export const GET_RECENT_USERS = gql`
  query GetRecentUsers($limit: Int = 5) {
    users(limit: $limit, orderBy: { createdAt: DESC }) {
      id
      firstName
      lastName
      email
      profileImageUrl
      role
      isVerified
      createdAt
    }
  }
`
