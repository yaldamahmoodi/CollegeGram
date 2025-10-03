import { createFileRoute } from '@tanstack/react-router'
import { TechOverviewGrid } from '@/components/tech-overview-card'
import { SiteHeader } from '@/components/site-header'

function Projects() {
  return (
    <>
    <SiteHeader title="Projects" />
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">DevSync Projects</h1>
          <p className="text-muted-foreground mt-1">
            Technical overview of our monorepo applications and their latest development status.
          </p>
        </div>
      </div>
      
      <TechOverviewGrid />
    </div>
    </>
  )
}

export const Route = createFileRoute('/projects')({
  component: Projects,
})