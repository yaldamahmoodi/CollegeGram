import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGitInfo } from "@/hooks/useGitInfo"
import { 
  Code2Icon, 
  GlobeIcon, 
  FileTextIcon,
  GitBranchIcon,
  CalendarIcon,
  RefreshCwIcon
} from "lucide-react"

interface TechOverviewCardProps {
  title: string
  description: string
  icon: React.ReactNode
  techStack: string[]
  projectUrl: string
  status: "active" | "stable" | "development"
}

export function TechOverviewCard({
  title,
  description,
  icon,
  techStack,
  projectUrl,
  status
}: TechOverviewCardProps) {
  const { branch, remoteBranch, latestCommit, isLoading, error } = useGitInfo()
  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    stable: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    development: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <Badge className={`${statusColors[status]} text-xs`}>
                {status}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-1">
            {techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <GitBranchIcon className="w-3 h-3" />
            <span>Branch: {isLoading ? 'loading...' : branch}</span>
            {remoteBranch && (
              <span className="text-xs text-muted-foreground">
                → {remoteBranch.replace('origin/', '')}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Latest Commit</span>
            {isLoading && <RefreshCwIcon className="w-3 h-3 animate-spin" />}
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
              {isLoading ? 'loading...' : latestCommit.hash}
            </code>
            <CalendarIcon className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {isLoading ? 'loading...' : latestCommit.date}
            </span>
          </div>
          {latestCommit.message && (
            <div className="mt-1 text-xs text-muted-foreground">
              <div className="truncate">{latestCommit.message}</div>
              {latestCommit.author && (
                <div className="text-xs text-muted-foreground/70 mt-1">
                  by {latestCommit.author}
                </div>
              )}
            </div>
          )}
          {error && (
            <div className="mt-1 text-xs text-red-500">
              Error: {error}
            </div>
          )}
        </div>

        <div className="pt-2">
          <a 
            href={projectUrl} 
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export function TechOverviewGrid() {
  const projects = [
    {
      title: "DevSync API",
      description: "Robust backend API built with Node.js, Express, and TypeScript. Features comprehensive authentication, real-time notifications via Socket.IO, advanced search with Elasticsearch, and comprehensive health monitoring with metrics collection.",
      icon: <Code2Icon className="w-6 h-6 text-blue-600" />,
      techStack: ["Node.js", "Express", "TypeScript", "MongoDB", "Redis", "Elasticsearch", "Socket.IO"],
      projectUrl: "/api/docs",
      status: "active" as const
    },
    {
      title: "DevSync Web",
      description: "Modern React-based social platform with real-time features, advanced UI components, and responsive design. Implements comprehensive user management, post sharing, notifications, and interactive social features.",
      icon: <GlobeIcon className="w-6 h-6 text-green-600" />,
      techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Socket.IO Client"],
      latestCommit: "54fd2be", 
      commitDate: "fix: pnpm",
      projectUrl: "/",
      status: "active" as const
    },
    {
      title: "DevSync Docs",
      description: "Interactive documentation and monitoring dashboard built with React, TanStack Router, and real-time system metrics. Features comprehensive health checks, API monitoring, and system resource tracking with beautiful data visualizations.",
      icon: <FileTextIcon className="w-6 h-6 text-purple-600" />,
      techStack: ["React", "TanStack Router", "TypeScript", "Vite", "Tailwind CSS", "Recharts"],
      projectUrl: "/dashboard",
      status: "stable" as const
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <TechOverviewCard key={project.title} {...project} />
      ))}
    </div>
  )
}
