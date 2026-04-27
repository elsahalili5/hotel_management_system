import { Button } from '#/components/Button'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/(app)/users')({
  component: RouteComponent,
})

function RouteComponent() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then((response) => response.json())
      .then((response) => {
        console.log('users', response)
        setUsers(response)
      })
  }, [])

  const handleDelete = (id: string) => {
    fetch(`http://localhost:5000/api/users?userId=${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json)
      .then((response) => {
        console.log('user deleted', response)
        setUsers(users.filter((user) => user.id !== id))
      })
  }

  return (
    <div>
      <ul>
        {users.map((user) => {
          return (
            <li key={user.id}>
              {user.id}, {user.name}, {user.address}
              <Button
                className="border-t-neutral-600 p"
                onClick={() => handleDelete(user.id)}
              >
                X
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
