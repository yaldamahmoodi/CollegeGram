import { SiteHeader } from '@/components/site-header'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import { 
  BookOpenIcon,
  BuildingIcon,
  DatabaseIcon,
  ServerIcon,
  FileTextIcon,
  SearchIcon,
  MailIcon,
  MessageSquareIcon,
  BellIcon,
  BarChartIcon,
  FolderIcon,
  UsersIcon,
  ArrowRightIcon
} from "lucide-react"

function Overview() {
  return (
    <>
      <SiteHeader title="Documentation Overview" />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DevSync Documentation Overview</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive guide to all system documentation, architecture, and technical implementations.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
              System Documentation
            </CardTitle>
            <CardDescription>
              Core system architecture and deployment documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/architecture" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BuildingIcon className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">System Architecture</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Clean Architecture, SOLID principles, and system design patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Controller-Service-Repository pattern</p>
                      <p>• SOLID principles implementation</p>
                      <p>• System design & scalability</p>
                      <p>• Data flow architecture</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/database" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <DatabaseIcon className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-lg">Database Schema</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Complete Entity Relationship Diagram (ERD) and data models
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• 15 core database entities</p>
                      <p>• User management & authentication</p>
                      <p>• Social features (posts, comments, likes)</p>
                      <p>• Monitoring & analytics models</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/deployment" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ServerIcon className="w-5 h-5 text-purple-600" />
                      <CardTitle className="text-lg">Deployment Guide</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Production deployment with Docker, Nginx, and GitLab CI/CD
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Docker Compose orchestration</p>
                      <p>• Nginx reverse proxy setup</p>
                      <p>• GitLab CI/CD pipeline</p>
                      <p>• Ubuntu server configuration</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/api-conventions" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <FileTextIcon className="w-5 h-5 text-orange-600" />
                      <CardTitle className="text-lg">API Conventions</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      RESTful API documentation and Swagger integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• OpenAPI 3.0 specification</p>
                      <p>• JWT authentication</p>
                      <p>• Interactive Swagger UI</p>
                      <p>• API endpoint documentation</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-green-600" />
              Technical Integrations
            </CardTitle>
            <CardDescription>
              Advanced technologies and real-time features implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/elasticsearch" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <SearchIcon className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">Elasticsearch</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Distributed search engine for real-time data processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Full-text search capabilities</p>
                      <p>• Real-time indexing</p>
                      <p>• Analytics & monitoring</p>
                      <p>• Node.js client integration</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/mailpit" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-5 h-5 text-red-600" />
                      <CardTitle className="text-lg">Mailpit</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Email testing platform for development environments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• SMTP server for testing</p>
                      <p>• Web UI for email inspection</p>
                      <p>• WebSocket real-time events</p>
                      <p>• Nodemailer integration</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/socketio" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquareIcon className="w-5 h-5 text-purple-600" />
                      <CardTitle className="text-lg">Socket.io</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Real-time bidirectional communication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Live messaging & notifications</p>
                      <p>• Presence system</p>
                      <p>• Room-based architecture</p>
                      <p>• JWT authentication</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/service-workers" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BellIcon className="w-5 h-5 text-yellow-600" />
                      <CardTitle className="text-lg">Service Workers</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Push notifications and offline functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Background push notifications</p>
                      <p>• Offline app capabilities</p>
                      <p>• VAPID authentication</p>
                      <p>• Progressive Web App features</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderIcon className="w-5 h-5 text-purple-600" />
              Project Information
            </CardTitle>
            <CardDescription>
              Live project status and team information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/projects" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <FolderIcon className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">Technical Projects</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Live project status with Git commit information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• API service overview</p>
                      <p>• Web application status</p>
                      <p>• Documentation platform</p>
                      <p>• Live Git integration</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/team" className="group">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-lg">Development Team</CardTitle>
                      <ArrowRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription>
                      Team member profiles and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• 6 development team members</p>
                      <p>• Individual profiles</p>
                      <p>• Resume downloads</p>
                      <p>• Contact information</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground border-l-2 border-muted pl-4">
          <p><strong>Comprehensive Documentation:</strong> Complete technical documentation covering architecture, deployment, integrations, and team information</p>
          <p><strong>Live Integration:</strong> Real-time project status with Git commit tracking and live system monitoring</p>
          <p><strong>Developer-Friendly:</strong> Interactive documentation with code examples, flow diagrams, and best practices</p>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/overview')({
  component: Overview,
})