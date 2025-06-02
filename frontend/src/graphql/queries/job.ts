import { gql } from '@apollo/client'

export const GET_JOBS = gql`
  query GetJobs($paginationDto: PaginationDto) {
    jobs(paginationDto: $paginationDto) {
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
      meta {
        total
        page
        lastPage
        limit
      }
    }
  }
`

export const GET_JOB = gql`
  query GetJob($id: String!) {
    job(id: $id) {
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
`

export const GET_JOBS_BY_COMPANY = gql`
  query GetJobsByCompany($companyId: String!, $paginationDto: PaginationDto) {
    jobsByCompany(companyId: $companyId, paginationDto: $paginationDto) {
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
      meta {
        total
        page
        lastPage
        limit
      }
    }
  }
`

export const CREATE_JOB = gql`
  mutation CreateJob($createJobInput: CreateJobInput!) {
    createJob(createJobInput: $createJobInput) {
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
`
