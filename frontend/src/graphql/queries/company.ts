import { gql } from "@apollo/client";

export const GET_COMPANIES = gql`
  query Companies($paginationDto: PaginationDto) {
    Companies(paginationDto: $paginationDto) {
      results {
        id
        name
        description
        website
        createdAt
        updatedAt
      }
      meta {
        total
        page
        lastPage
        limit
      }
    }
  }
`;



export const GET_COMPANY_BY_ID = gql`
  query GetCompanyById($id: ID!, $companyId: String!) {
    Company(id: $id) {
      id
      name
      description
      website
      createdAt
      updatedAt
    }

    jobsByCompany(companyId: $companyId) {
      results {
        id
        title
        description
        location
        salary
        companyId
        createdAt
        updatedAt
      }
    }
  }
`


export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      description
      website
      createdAt
    }
  }
`

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: String!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      description
      website
      updatedAt
    }
  }
`

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: String!) {
    deleteCompany(id: $id) {
      id
      name
    }
  }
`

export const CHECK_COMPANY_PERMISSIONS = gql`
    query CheckCompanyPermissions($companyId: ID!) {
    checkCompanyPermissions(companyId: $companyId) {
      canEdit
      canDelete
      role
    }
  }
`
