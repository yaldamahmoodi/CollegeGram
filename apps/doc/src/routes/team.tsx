import { createFileRoute } from '@tanstack/react-router'

function Team() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Team</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium">Team Management</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your team members and collaborate effectively.
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/team')({
  component: Team,
})