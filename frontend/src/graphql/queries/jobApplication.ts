import { gql } from '@apollo/client'

export const APPLY_TO_JOB = gql`
  mutation ApplyToJob($input: ApplyJobInput!) {
    applyToJob(input: $input) {
      id
      userId
      jobId
      createdAt
      status
      decidedAt
    }
  }
`

export const MY_APPLICATIONS = gql`
  query MyApplications {
    myApplications {
      id
      userId
      jobId
      createdAt
      status
      decidedAt
    }
  }
`

export const GET_APPLICANTS_FOR_JOB = gql`
  query GetApplicantsForJob($jobId: String!) {
    applicantsForJob(jobId: $jobId) {
      id
      userId
      jobId
      createdAt
      status
      decidedAt
      user {
        id
        username
        email
        profilePhoto
      }
    }
  }
`

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($applicationId: String!, $updatedApplication: UpdateApplicationInput!) {
    updateApplication(applicationId: $applicationId, updatedApplication: $updatedApplication) {
      id
      userId
      jobId
      createdAt
      status
      decidedAt
    }
  }
`
