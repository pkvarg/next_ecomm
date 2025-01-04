import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAllUsers } from '../_actions/users'
import { PageHeader } from '../_components/PageHeader'

export default function LogsPage() {
  return (
    <>
      <PageHeader>Logs</PageHeader>
      <UsersTable />
    </>
  )
}

async function UsersTable() {
  const users = await getAllUsers()

  console.log('users', users)

  if (users.length === 0) return <p>No logs found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Subscriber</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead>Last Update</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>

            <TableCell>{user.subscriber ? 'Yes' : 'No'}</TableCell>
            <TableCell>{user.lastLogin.toISOString()}</TableCell>
            <TableCell>{user.updatedAt.toISOString()}</TableCell>

            {/* <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id={user.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
