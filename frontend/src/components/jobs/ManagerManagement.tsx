import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Edit3,
  Shield,
  ShieldCheck,
  Search,
  MoreVertical
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useListManagers, useAddManager, useRemoveManager, useUpdateManager } from "@/services/companyManagerService"
import { ManagerRole, CompanyManager } from "@/graphql/types/companyManager"
import { useToast } from "@/hooks/use-toast"

interface ManagerManagementProps {
  companyId: string
}

export const ManagerManagement: React.FC<ManagerManagementProps> = ({ companyId }) => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState<CompanyManager | null>(null)
  const [newManagerEmail, setNewManagerEmail] = useState("")
  const [newManagerRole, setNewManagerRole] = useState<ManagerRole>(ManagerRole.EDITOR)
  const [editRole, setEditRole] = useState<ManagerRole>(ManagerRole.EDITOR)
  const { data: managersData, loading, error, refetch } = useListManagers(companyId)
  const [addManager, { loading: addingManager }] = useAddManager()
  const [removeManager] = useRemoveManager()
  const [updateManager, { loading: updatingManager }] = useUpdateManager()

  const managers = managersData?.listManagers || []
  const filteredManagers = managers.filter(manager =>
    manager.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddManager = async () => {
    try {
      // In a real app, you'd need to search for users by email
      // For now, we'll assume the email is actually a userId
      await addManager({
        variables: {
          input: {
            userId: newManagerEmail, // This should be converted from email to userId
            companyId,
            role: newManagerRole
          }
        }
      })
      
      toast({
        title: "Manager Added",
        description: "The manager has been successfully added to the company.",
      })
      
      setIsAddDialogOpen(false)
      setNewManagerEmail("")
      setNewManagerRole(ManagerRole.EDITOR)
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Failed to add manager.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveManager = async (managerId: string) => {
    if (!window.confirm("Are you sure you want to remove this manager?")) return

    try {
      await removeManager({
        variables: {
          companyId,
          managerId
        }
      })
      
      toast({
        title: "Manager Removed",
        description: "The manager has been successfully removed from the company.",
      })
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Failed to remove manager.",
        variant: "destructive",
      })
    }
  }

  const handleEditManager = (manager: CompanyManager) => {
    setSelectedManager(manager)
    setEditRole(manager.role)
    setIsEditDialogOpen(true)
  }

  const handleUpdateManager = async () => {
    if (!selectedManager) return

    try {
      await updateManager({
        variables: {
          input: {
            managerId: selectedManager.id,
            companyId,
            role: editRole
          }
        }
      })
      
      toast({
        title: "Manager Updated",
        description: "The manager's role has been successfully updated.",
      })
      
      setIsEditDialogOpen(false)
      setSelectedManager(null)
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Failed to update manager.",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: ManagerRole) => {
    return role === ManagerRole.ADMIN ? (
      <ShieldCheck className="h-4 w-4 text-red-500" />
    ) : (
      <Shield className="h-4 w-4 text-blue-500" />
    )
  }

  const getRoleBadgeVariant = (role: ManagerRole) => {
    return role === ManagerRole.ADMIN ? "destructive" : "secondary"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manager Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading managers...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manager Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error loading managers: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manager Management
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Manager
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Manager</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">User Email/ID</Label>
                  <Input
                    id="email"
                    placeholder="Enter user email or ID"
                    value={newManagerEmail}
                    onChange={(e) => setNewManagerEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Note: Currently requires the exact user ID. In a production app, this would search users by email.
                  </p>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newManagerRole} 
                    onValueChange={(value) => setNewManagerRole(value as ManagerRole)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ManagerRole.EDITOR}>Editor</SelectItem>
                      <SelectItem value={ManagerRole.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddManager}
                    disabled={addingManager || !newManagerEmail}
                  >
                    {addingManager ? "Adding..." : "Add Manager"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search managers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Managers List */}
        {filteredManagers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No managers found</h3>
            <p className="text-muted-foreground">
              {managers.length === 0 
                ? "No managers have been assigned to this company yet."
                : "No managers match your search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredManagers.map((manager) => (
              <div 
                key={manager.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">                  <Avatar>
                    <AvatarImage src={manager.user?.profilePhoto} />
                    <AvatarFallback>
                      {manager.user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {manager.user?.username}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {manager.user?.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getRoleBadgeVariant(manager.role)}
                    className="gap-1"
                  >
                    {getRoleIcon(manager.role)}
                    {manager.role}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditManager(manager)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleRemoveManager(manager.id)}
                        className="text-destructive"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove Manager
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Manager Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Manager Role</DialogTitle>
          </DialogHeader>
          {selectedManager && (
            <div className="space-y-4">              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedManager.user?.profilePhoto} />
                  <AvatarFallback>
                    {selectedManager.user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {selectedManager.user?.username}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedManager.user?.email}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="editRole">Role</Label>
                <Select 
                  value={editRole} 
                  onValueChange={(value) => setEditRole(value as ManagerRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ManagerRole.EDITOR}>Editor</SelectItem>
                    <SelectItem value={ManagerRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateManager}
                  disabled={updatingManager || editRole === selectedManager.role}
                >
                  {updatingManager ? "Updating..." : "Update Role"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
