import { createFileRoute } from '@tanstack/react-router'
import { TeamGrid } from '@/components/team-member-card'
import { SiteHeader } from '@/components/site-header'

function Team() {
  return (
    <>
    <SiteHeader title="Team" />
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">DevSync Team</h1>
          <p className="text-muted-foreground mt-1">
            Meet our talented team of developers, designers, and engineers building the future.
          </p>
        </div>
      </div>
      
      <TeamGrid />
    </div>
    </>
  )
}

export const Route = createFileRoute('/team')({
  component: Team,
})