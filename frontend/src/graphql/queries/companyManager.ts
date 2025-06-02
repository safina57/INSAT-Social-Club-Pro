import { gql } from '@apollo/client'

export const GET_MANAGED_COMPANIES = gql`
    query GetManagedCompanies {
        getManagedCompanies {
            id
            userId
            companyId
            role
        }
    }
`

export const LIST_MANAGERS = gql`
  query ListManagers($companyId: ID!) {
    listManagers(companyId: $companyId) {
      id
      userId
      companyId
      role
      user {
        id
        username
        email
        profilePhoto
      }
    }
  }
`

export const ADD_MANAGER = gql`
  mutation AddManager($input: CreateCompanyManagerInput!) {
    addManager(input: $input) {
      id
      userId
      companyId
      role
    }
  }
`

export const REMOVE_MANAGER = gql`
  mutation RemoveManager($companyId: ID!, $managerId: ID!) {
    removeManager(companyId: $companyId, managerId: $managerId)
  }
`

export const UPDATE_MANAGER = gql`
  mutation UpdateManager($input: UpdateCompanyManagerInput!) {
    updateManager(input: $input) {
      id
      userId
      companyId
      role
    }
  }
`
