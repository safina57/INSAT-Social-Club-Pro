export interface Company {
  id: string
  name: string
  description?: string
  logo?: string
  website?: string
}

export interface User {
  id: string
  username: string
  email: string
  profilePhoto?: string
}

export interface CompanyManager {
  id: string
  userId: string
  companyId: string
  role: ManagerRole
  company?: Company
  user?: User
}

export enum ManagerRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR'
}

export interface CreateCompanyManagerInput {
  userId: string
  companyId: string
  role: ManagerRole
}

export interface UpdateCompanyManagerInput {
  managerId: string
  companyId: string
  role: ManagerRole
}
