import { gql } from '@apollo/client'

export const GET_MY_CONVERSATIONS = gql`
  query GetMyConversations {
    getMyConversations {
      id
      participants {
        id
        username
      }
      messages {
        content
        senderId
        createdAt
      }
    }
  }
`

export const GET_MESSAGES = gql`
  query GetMessages($withUserId: String!) {
    getMessages(withUserId: $withUserId) {
      id
      content
      senderId
      createdAt
    }
  }
`