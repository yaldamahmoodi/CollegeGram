import { SiteHeader } from '@/components/site-header'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileTextIcon, 
  ShieldIcon,
  UsersIcon,
  MessageSquareIcon,
  CodeIcon
} from "lucide-react"

function ApiConventions() {
  return (
    <>
      <SiteHeader title="API Conventions" />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">API Conventions & Documentation</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive API documentation following OpenAPI 3.0 specification with Swagger UI integration.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-blue-600" />
              API Overview
            </CardTitle>
            <CardDescription>
              RESTful API following OpenAPI 3.0 specification with comprehensive documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-700 dark:text-blue-300">Authentication</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Type:</strong> Bearer Token (JWT)</p>
                    <p><strong>Header:</strong> Authorization: Bearer token</p>
                    <p><strong>Expiration:</strong> 24 hours</p>
                    <p><strong>Refresh:</strong> Automatic</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <UsersIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-700 dark:text-green-300">User Management</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Registration:</strong> POST /api/auth/register</p>
                    <p><strong>Login:</strong> POST /api/auth/login</p>
                    <p><strong>Profile:</strong> GET /api/users/profile</p>
                    <p><strong>Update:</strong> PUT /api/users/profile</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-700 dark:text-purple-300">Posts & Comments</h3>
                  </div>
                  <div className="text-xs space-y-1">
                    <p><strong>Posts:</strong> GET/POST /api/posts</p>
                    <p><strong>Comments:</strong> GET/POST /api/comments</p>
                    <p><strong>Likes:</strong> POST /api/posts/like</p>
                    <p><strong>Feed:</strong> GET /api/posts/feed</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className="w-5 h-5 text-green-600" />
              Swagger Documentation
            </CardTitle>
            <CardDescription>
              Interactive API documentation available at /api-docs endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <FileTextIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Swagger Documentation</h3>
              <p className="text-muted-foreground mb-4">
                Interactive API documentation is available at the /api-docs endpoint when the API server is running.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Access the Swagger UI at: <code>http://localhost:3001/api-docs</code></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground border-l-2 border-muted pl-4">
          <p><strong>Documentation:</strong> Comprehensive API documentation following OpenAPI 3.0 specification with interactive Swagger UI</p>
          <p><strong>Authentication:</strong> JWT-based authentication with secure token management and automatic refresh</p>
          <p><strong>Integration:</strong> Seamless integration with frontend applications using consistent API conventions</p>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/api-conventions')({
  component: ApiConventions,
})