import React from "react"
import { useLocation } from "react-router-dom"
import { JobManagementDashboard } from "@/components/jobs/JobManagementDashboard"
import { ManagerManagement } from "@/components/jobs/ManagerManagement"
import { Header } from "@/components/common/header"
import Aurora from "@/components/ui/Aurora"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, Briefcase } from "lucide-react"
import { useManagedCompanies } from "@/services/companyManagerService"

const JobManagementPage: React.FC = () => {
  const location = useLocation()
  const { data: managedCompaniesData, loading, error } = useManagedCompanies()
  
  // Get the first company the user manages
  const managedCompanies = managedCompaniesData?.getManagedCompanies || []
  const firstManagedCompany = managedCompanies[0]
  
  // Use company ID from location state or the first managed company
  const companyId = location.state?.companyId || firstManagedCompany?.companyId || "1"

  console.log('JobManagementPage - Managed Companies:', managedCompanies)
  console.log('JobManagementPage - Using company ID:', companyId)

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={[
              "#003B49", // Aqua blue
              "#003B49", // Dark green
            ]}
            blend={0.2}
            amplitude={1.2}
            speed={0.5}
          />
        </div>
        <Header />
        <div className="container mx-auto px-4 py-8 content-z-index">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading managed companies...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || managedCompanies.length === 0) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={[
              "#003B49", // Aqua blue
              "#003B49", // Dark green
            ]}
            blend={0.2}
            amplitude={1.2}
            speed={0.5}
          />
        </div>
        <Header />
        <div className="container mx-auto px-4 py-8 content-z-index">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                No Company Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You don't have manager access to any companies. Please contact an administrator to be assigned as a company manager.
              </p>
              {error && (
                <p className="text-red-500 mt-2 text-sm">
                  Error: {error.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={[
            "#003B49", // Aqua blue
            "#003B49", // Dark green
          ]}
          blend={0.2}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        {/* Show managed company info */}
        {managedCompanies.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Managing: {firstManagedCompany?.company?.name || `Company ${companyId}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You are managing {managedCompanies.length} company{managedCompanies.length > 1 ? 'ies' : ''}
              </p>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="jobs" className="mb-4">
          <TabsList>
            <TabsTrigger value="jobs" className="flex-1">
              <Briefcase className="mr-2 h-5 w-5" />
              Job Management
            </TabsTrigger>
            <TabsTrigger value="managers" className="flex-1">
              <Users className="mr-2 h-5 w-5" />
              Manager Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <JobManagementDashboard companyId={companyId} />
          </TabsContent>
          <TabsContent value="managers">
            <ManagerManagement companyId={companyId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default JobManagementPage
