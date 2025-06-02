export enum Category {
  General_Inquiry = "General_Inquiry",
  Technical_Support = "Technical_Support",
  Feedback = "Feedback",
  Bug_Report = "Bug_Report",
  Feature_Request = "Feature_Request",
}

export enum Status {
  Pending = "Pending",
  Being_Treated = "Being_Treated",
  Treated = "Treated",
}

export interface ContactReport {
  id: string
  fullName: string
  email: string
  subject: string
  category: Category
  message: string
  status: Status
  createdAt: string
}
