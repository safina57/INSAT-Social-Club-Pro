"use client"

import { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Header } from "../common/header"
import { AdminSidebar } from "./admin-sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"
const ITEMS_PER_PAGE = 10

interface User {
  id: string
  username: string
  email: string
  createdAt: string
  profilePhoto?: string
}

interface UsersQueryData {
  users: {
    results: User[]
    meta: {
      total: number
      page: number
      lastPage: number
    }
  }
}

const GET_USERS = gql`
  query GetUsers($page: Int!, $limit: Int!) {
    users(paginationDto: { page: $page, limit: $limit }) {
      results {
        id
        username
        email
        createdAt
        profilePhoto
      }
      meta {
        total
        page
        lastPage
      }
    }
  }
`

const REMOVE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id){
      id
    }
  }
`

export default function AdminUsers() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, loading, error, refetch } = useQuery<UsersQueryData>(GET_USERS, {
    variables: { page: currentPage, limit: ITEMS_PER_PAGE },
  })

  const [removeUser] = useMutation(REMOVE_USER)
  const navigate = useNavigate()
  const allUsers = data?.users.results ?? []
  const totalPages = data?.users.meta.lastPage ?? 1
  const totalUsers = data?.users.meta.total ?? 0
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + allUsers.length

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleUserAction = async (id: string, action: "view" | "delete") => {
    if (action === "view") {
      navigate(`/profile/${id}`) 
    } else if (action === "delete") {
      try {
        await removeUser({ variables: { id } })
        refetch()
      } catch (err) {
        console.error("Error deleting user", err)
      }
    }
  }

  if (loading) return <div>Loading users…</div>
  if (error) return <div className="text-red-500">Error loading users</div>

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">Manage and monitor user accounts</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Users ({totalUsers})</CardTitle>
                <CardDescription>
                  Showing {startIndex + 1}-{endIndex} of {totalUsers} users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Avatar>
                              {user.profilePhoto ? (
                                <AvatarImage src={user.profilePhoto} alt={user.username} />
                              ) : (
                                <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                              )}
                            </Avatar>
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, "view")}>
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, "delete")} className="text-red-600">
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between p-4">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
