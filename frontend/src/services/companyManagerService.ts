import { useQuery, useMutation } from '@apollo/client'
import { GET_MANAGED_COMPANIES, LIST_MANAGERS, ADD_MANAGER, REMOVE_MANAGER, UPDATE_MANAGER } from '@/graphql/queries/companyManager'
import { CompanyManager, CreateCompanyManagerInput, UpdateCompanyManagerInput } from '@/graphql/types/companyManager'

export const useManagedCompanies = () => {
  return useQuery<{ getManagedCompanies: CompanyManager[] }>(GET_MANAGED_COMPANIES, {
    errorPolicy: 'all',
  })
}

export const useListManagers = (companyId: string) => {
  return useQuery<{ listManagers: CompanyManager[] }>(LIST_MANAGERS, {
    variables: { companyId },
    errorPolicy: 'all',
  })
}

export const useAddManager = () => {
  return useMutation<{ addManager: CompanyManager }, { input: CreateCompanyManagerInput }>(ADD_MANAGER)
}

export const useRemoveManager = () => {
  return useMutation<{ removeManager: boolean }, { companyId: string, managerId: string }>(REMOVE_MANAGER)
}

export const useUpdateManager = () => {
  return useMutation<{ updateManager: CompanyManager }, { input: UpdateCompanyManagerInput }>(UPDATE_MANAGER)
}
